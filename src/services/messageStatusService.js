// import the message status data model
import { MessageStatus } from '../db/models/messageStatusModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "MessageStatus" catalog entity.
 *
 * Encapsulates all the business logic and database access related to the
 * statuses a message can have (e.g. sent, delivered, read). Every public
 * method resolves with the requested data or rejects with a normalized
 * Boom error.
 */
export class MessageStatusServices {

  /**
   * Creates a new message status record.
   *
   * @param {Object} newMessageStatus - Data of the message status.
   * @param {string} newMessageStatus.name - Unique name of the status.
   * @param {string} [newMessageStatus.description] - Optional description.
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} Conflict if it already exists, internal error otherwise.
   */
  async createOne(newMessageStatus) {

    try {
      // check whether a status with the same name already exists
      const existingMessageStatus = await MessageStatus.findOne({
        where: { name: newMessageStatus.name }
      });

      // if it exists, reject the insertion to keep names unique
      if (existingMessageStatus) {
        throw Boom.conflict('Message status already exists');
      }

      // create a new record in the database
      await MessageStatus.create({
        name: newMessageStatus.name,
        description: newMessageStatus.description,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new message status' });
    }
  }

  /**
   * Updates an existing message status by its identifier.
   *
   * @param {number} messageStatusId - Identifier of the record to update.
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest if no data is provided, NotFound if it does not exist.
   */
  async updateOne(messageStatusId, newData) {

    if (!newData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    try {
      // update the record in the database
      const [updatedRows] = await MessageStatus.update(
        {
          name: newData.name,
          description: newData.description,
        },
        {
          where: { id: messageStatusId }
        }
      );

      // if no rows were affected, the record does not exist
      if (!updatedRows) {
        throw Boom.notFound('Message status not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update message status' });
    }
  }

  /**
   * Deletes a message status by its identifier.
   *
   * @param {number} messageStatusId - Identifier of the record to delete.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async deleteOne(messageStatusId) {

    if (!messageStatusId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No message status ID provided');
    }

    try {
      // destroy the record in the database
      const deletedRows = await MessageStatus.destroy({
        where: { id: messageStatusId }
      });

      // if no rows were deleted, the record does not exist
      if (!deletedRows) {
        throw Boom.notFound('Message status not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete message status' });
    }
  }

  /**
   * Retrieves a single message status by its identifier.
   *
   * @param {number} messageStatusId - Identifier of the record to find.
   * @returns {Promise<Object>} The message status record.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async listOne(messageStatusId) {

    if (!messageStatusId) {
      throw Boom.badRequest('No message status ID provided');
    }

    try {
      const theMessageStatus = await MessageStatus.findOne({
        where: { id: messageStatusId }
      });

      if (!theMessageStatus) {
        throw Boom.notFound('Message status not found');
      }

      return theMessageStatus;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find message status' });
    }
  }

  /**
   * Retrieves every message status ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of message statuses (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allMessageStatuses = await MessageStatus.findAll({
        order: [['id', 'ASC']]
      });

      // always return an array, even when there are no records
      return allMessageStatuses.length ? allMessageStatuses : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find message statuses' });
    }
  }
}