// import the message data model
import { Message } from '../db/models/messageModel.js';
// import related models to validate foreign key relations
import { MessageStatus } from '../db/models/messageStatusModel.js';
import { User } from '../db/models/userModel.js';
// Op is needed to express the "sender OR receiver" ownership condition
import { Op } from 'sequelize';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "Message" entity.
 *
 * A message has a textual "content", a "sentAt" timestamp and three required
 * foreign keys: its status ("statusId"), the sender user ("senderUserId") and
 * the receiver user ("receiverUserId"). All foreign keys are validated on every
 * write operation to preserve referential integrity.
 *
 * Update and delete are participant-scoped: only the message's sender or its
 * receiver may modify or remove it, enforced via the ownership filter below.
 *
 * Association aliases (defined in setupAssociations):
 *   - status   -> Message.belongsTo(MessageStatus)
 *   - sender   -> Message.belongsTo(User)
 *   - receiver -> Message.belongsTo(User)
 */
export class MessageServices {

  /**
   * Builds a Sequelize "where" filter that matches a message by id, but
   * only when the given user is its sender or its receiver.
   *
   * @param {number} messageId - Identifier of the message.
   * @param {number} requestingUserId - Identifier of the user attempting the action.
   * @returns {Object} Sequelize where clause.
   */
  #ownedByParticipant(messageId, requestingUserId) {
    return {
      id: messageId,
      [Op.or]: [
        { senderUserId: requestingUserId },
        { receiverUserId: requestingUserId },
      ],
    };
  }

  /**
   * Creates a new message after validating all of its relations.
   *
   * @param {Object} newMessage - Message data.
   * @param {string} newMessage.content - Message content.
   * @param {number} newMessage.statusId - Message status identifier.
   * @param {number} newMessage.senderUserId - Sender user identifier.
   * @param {number} newMessage.receiverUserId - Receiver user identifier.
   * @param {string} [newMessage.sentAt] - Optional send timestamp (defaults to now).
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} NotFound for missing relations, BadRequest for invalid data.
   */
  async createOne(newMessage) {

    try {
      // a message cannot be sent to oneself
      if (newMessage.senderUserId === newMessage.receiverUserId) {
        throw Boom.badRequest('Sender and receiver must be different users');
      }

      // ensure the message status exists
      const messageStatus = await MessageStatus.findByPk(newMessage.statusId);
      if (!messageStatus) {
        throw Boom.notFound('Message status not found');
      }

      // ensure the sender user exists
      const senderUser = await User.findByPk(newMessage.senderUserId);
      if (!senderUser) {
        throw Boom.notFound('Sender user not found');
      }

      // ensure the receiver user exists
      const receiverUser = await User.findByPk(newMessage.receiverUserId);
      if (!receiverUser) {
        throw Boom.notFound('Receiver user not found');
      }

      // create a new record in the database
      await Message.create({
        content: newMessage.content,
        sentAt: newMessage.sentAt,
        statusId: newMessage.statusId,
        senderUserId: newMessage.senderUserId,
        receiverUserId: newMessage.receiverUserId,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new message' });
    }
  }

  /**
   * Updates an existing message by its identifier. Typically used to change
   * the message status (e.g. delivered, read).
   *
   * Only the message's sender or receiver may update it; the message must
   * belong to the requesting user in one of those two roles, or the update
   * is rejected as if the message did not exist.
   *
   * @param {number} messageId - Identifier of the message to update.
   * @param {number} requestingUserId - Identifier of the user performing the update (sender or receiver).
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async updateOne(messageId, requestingUserId, newData) {

    if (!messageId) {
      throw Boom.badRequest('No message ID provided');
    }

    if (!requestingUserId) {
      throw Boom.badRequest('No requesting user ID provided');
    }

    if (!newData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    try {
      // First verify that the message exists and that the requesting user
      // is either its sender or its receiver
      const existingMessage = await Message.findOne({
        where: this.#ownedByParticipant(messageId, requestingUserId),
      });

      if (!existingMessage) {
        throw Boom.notFound('Message not found, or you are not its sender or receiver');
      }

      // validate the status relation only when it is being changed
      if (newData.statusId) {
        const messageStatus = await MessageStatus.findByPk(newData.statusId);
        if (!messageStatus) {
          throw Boom.notFound('Message status not found');
        }
      }

      // validate the sender relation only when it is being changed
      if (newData.senderUserId) {
        const senderUser = await User.findByPk(newData.senderUserId);
        if (!senderUser) {
          throw Boom.notFound('Sender user not found');
        }
      }

      // validate the receiver relation only when it is being changed
      if (newData.receiverUserId) {
        const receiverUser = await User.findByPk(newData.receiverUserId);
        if (!receiverUser) {
          throw Boom.notFound('Receiver user not found');
        }
      }

      // update the record in the database, scoped again to the same
      // ownership condition so the write itself cannot escape it
      const [updatedRows] = await Message.update(
        {
          content: newData.content,
          sentAt: newData.sentAt,
          statusId: newData.statusId,
          senderUserId: newData.senderUserId,
          receiverUserId: newData.receiverUserId,
        },
        {
          where: this.#ownedByParticipant(messageId, requestingUserId),
        }
      );

      // if no rows were affected, the message does not exist (or isn't theirs)
      if (!updatedRows) {
        throw Boom.notFound('Message not found, or you are not its sender or receiver');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update message' });
    }
  }

  /**
   * Deletes a message by its identifier.
   *
   * Only the message's sender or receiver may delete it; the message must
   * belong to the requesting user in one of those two roles, or the
   * deletion is rejected as if the message did not exist.
   *
   * @param {number} messageId - Identifier of the message to delete.
   * @param {number} requestingUserId - Identifier of the user performing the deletion (sender or receiver).
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist or isn't theirs.
   */
  async deleteOne(messageId, requestingUserId) {

    if (!messageId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No message ID provided');
    }

    if (!requestingUserId) {
      throw Boom.badRequest('No requesting user ID provided');
    }

    try {
      const ownershipFilter = this.#ownedByParticipant(messageId, requestingUserId);

      // First verify that the message exists and that the requesting user
      // is either its sender or its receiver
      const existingMessage = await Message.findOne({ where: ownershipFilter });

      if (!existingMessage) {
        throw Boom.notFound('Message not found, or you are not its sender or receiver');
      }

      // destroy the record in the database, scoped to the same condition
      const deletedRows = await Message.destroy({ where: ownershipFilter });

      // if no rows were deleted, the message does not exist (or isn't theirs)
      if (!deletedRows) {
        throw Boom.notFound('Message not found, or you are not its sender or receiver');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete message' });
    }
  }

  /**
   * Retrieves a single message, including its status, sender and receiver.
   *
   * @param {number} messageId - Identifier of the message.
   * @returns {Promise<Object>} The message record with its relations.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async listOne(messageId) {

    if (!messageId) {
      throw Boom.badRequest('No message ID provided');
    }

    try {
      const theMessage = await Message.findOne({
        where: { id: messageId },
        include: [
          { model: MessageStatus, as: 'status' },
          { model: User, as: 'sender' },
          { model: User, as: 'receiver' },
        ],
      });

      if (!theMessage) {
        throw Boom.notFound('Message not found');
      }

      return theMessage;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find message' });
    }
  }

  /**
   * Retrieves every message ordered by send date descending (newest first).
   *
   * @returns {Promise<Object[]>} List of messages (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allMessages = await Message.findAll({
        order: [['sentAt', 'DESC']],
        include: [
          { model: MessageStatus, as: 'status' },
          { model: User, as: 'sender' },
          { model: User, as: 'receiver' },
        ],
      });

      // always return an array, even when there are no records
      return allMessages.length ? allMessages : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find messages' });
    }
  }

  /**
   * Retrieves the full conversation exchanged between two users, ordered
   * chronologically (oldest first).
   *
   * @param {number} userAId - First participant identifier.
   * @param {number} userBId - Second participant identifier.
   * @returns {Promise<Object[]>} List of messages (empty array if none).
   * @throws {Boom} BadRequest if any id is missing, internal error otherwise.
   */
  async listConversation(userAId, userBId) {

    if (!userAId || !userBId) {
      throw Boom.badRequest('Both user IDs are required');
    }

    try {
      const conversation = await Message.findAll({
        where: {
          // messages in either direction between the two users
          // (use Sequelize Op in the calling layer if stricter filtering is needed)
          senderUserId: [userAId, userBId],
          receiverUserId: [userAId, userBId],
        },
        order: [['sentAt', 'ASC']],
        include: [
          { model: MessageStatus, as: 'status' },
          { model: User, as: 'sender' },
          { model: User, as: 'receiver' },
        ],
      });

      return conversation.length ? conversation : [];

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find conversation' });
    }
  }
}