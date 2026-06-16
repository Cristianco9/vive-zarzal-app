// import the user image data model
import { UserImage } from '../db/models/userImageModel.js';
// import the user model to validate the foreign key relation
import { User } from '../db/models/userModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "UserImage" entity.
 *
 * A user image belongs to a user through "userId" (required) and stores the
 * image "url", an optional "name" and an optional "altText". The foreign key
 * is validated on every write operation to preserve referential integrity.
 *
 * Association aliases (defined in setupAssociations):
 *   - user -> UserImage.belongsTo(User)
 */
export class UserImageServices {

  /**
   * Creates a new user image after validating its owner.
   *
   * @param {Object} newUserImage - User image data.
   * @param {number} newUserImage.userId - Owner user identifier.
   * @param {string} newUserImage.url - Image URL.
   * @param {string} [newUserImage.name] - Optional image name.
   * @param {string} [newUserImage.altText] - Optional alternative text.
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} NotFound if the user does not exist, internal error otherwise.
   */
  async createOne(newUserImage) {

    try {
      // ensure the owner user exists
      const ownerUser = await User.findByPk(newUserImage.userId);
      if (!ownerUser) {
        throw Boom.notFound('User not found');
      }

      // create a new record in the database
      await UserImage.create({
        userId: newUserImage.userId,
        url: newUserImage.url,
        name: newUserImage.name,
        altText: newUserImage.altText,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new user image' });
    }
  }

  /**
   * Updates an existing user image by its identifier, ensuring the user owns the image.
   *
   * @param {number} userImageId - Identifier of the record to update.
   * @param {number} userId - Identifier of the user requesting the update.
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest, NotFound, Forbidden or internal error.
   */
  async updateOne(userImageId, userId, newData) {

    if (!newData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    try {
      // First, find the user image to check ownership
      const userImage = await UserImage.findByPk(userImageId);
      if (!userImage) {
        throw Boom.notFound('User image not found');
      }

      // Check if the user is the owner of the image or an administrator
      // Note: This assumes the caller has already verified admin status if needed
      if (userImage.userId !== userId) {
        throw Boom.forbidden('You do not have permission to update this image');
      }

      // validate the owner relation only when it is being changed
      if (newData.userId) {
        const ownerUser = await User.findByPk(newData.userId);
        if (!ownerUser) {
          throw Boom.notFound('User not found');
        }
      }

      // update the record in the database
      const [updatedRows] = await UserImage.update(
        {
          userId: newData.userId,
          url: newData.url,
          name: newData.name,
          altText: newData.altText,
        },
        {
          where: { id: userImageId }
        }
      );

      // if no rows were affected, the record does not exist
      if (!updatedRows) {
        throw Boom.notFound('User image not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update user image' });
    }
  }

  /**
   * Updates an existing user image by its identifier (admin only).
   *
   * @param {number} userImageId - Identifier of the record to update.
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async updateOneAdmin(userImageId, newData) {

    if (!newData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    try {
      // validate the owner relation only when it is being changed
      if (newData.userId) {
        const ownerUser = await User.findByPk(newData.userId);
        if (!ownerUser) {
          throw Boom.notFound('User not found');
        }
      }

      // update the record in the database
      const [updatedRows] = await UserImage.update(
        {
          userId: newData.userId,
          url: newData.url,
          name: newData.name,
          altText: newData.altText,
        },
        {
          where: { id: userImageId }
        }
      );

      // if no rows were affected, the record does not exist
      if (!updatedRows) {
        throw Boom.notFound('User image not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update user image' });
    }
  }

  /**
   * Deletes a user image by its identifier, ensuring the user owns the image.
   *
   * @param {number} userImageId - Identifier of the record to delete.
   * @param {number} userId - Identifier of the user requesting the deletion.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest, NotFound, Forbidden or internal error.
   */
  async deleteOne(userImageId, userId) {

    if (!userImageId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No user image ID provided');
    }

    try {
      // First, find the user image to check ownership
      const userImage = await UserImage.findByPk(userImageId);
      if (!userImage) {
        throw Boom.notFound('User image not found');
      }

      // Check if the user is the owner of the image or an administrator
      // Note: This assumes the caller has already verified admin status if needed
      if (userImage.userId !== userId) {
        throw Boom.forbidden('You do not have permission to delete this image');
      }

      // destroy the record in the database
      const deletedRows = await UserImage.destroy({
        where: { id: userImageId }
      });

      // if no rows were deleted, the record does not exist
      if (!deletedRows) {
        throw Boom.notFound('User image not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete user image' });
    }
  }

  /**
   * Deletes a user image by its identifier (admin only).
   *
   * @param {number} userImageId - Identifier of the record to delete.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async deleteOneAdmin(userImageId) {

    if (!userImageId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No user image ID provided');
    }

    try {
      // destroy the record in the database
      const deletedRows = await UserImage.destroy({
        where: { id: userImageId }
      });

      // if no rows were deleted, the record does not exist
      if (!deletedRows) {
        throw Boom.notFound('User image not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete user image' });
    }
  }

  /**
   * Retrieves a single user image, including its owner.
   *
   * @param {number} userImageId - Identifier of the record to find.
   * @returns {Promise<Object>} The user image record with its relation.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async listOne(userImageId) {

    if (!userImageId) {
      throw Boom.badRequest('No user image ID provided');
    }

    try {
      const theUserImage = await UserImage.findOne({
        where: { id: userImageId },
        include: [{ model: User, as: 'user' }],
      });

      if (!theUserImage) {
        throw Boom.notFound('User image not found');
      }

      return theUserImage;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find user image' });
    }
  }

  /**
   * Retrieves every user image ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of user images (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allUserImages = await UserImage.findAll({
        order: [['id', 'ASC']],
        include: [{ model: User, as: 'user' }],
      });

      // always return an array, even when there are no records
      return allUserImages.length ? allUserImages : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find user images' });
    }
  }

  /**
   * Retrieves every image belonging to a specific user.
   *
   * @param {number} userId - Owner user identifier.
   * @returns {Promise<Object[]>} List of the user images (empty array if none).
   * @throws {Boom} BadRequest if no user id is provided, internal error otherwise.
   */
  async listAllByUser(userId) {

    if (!userId) {
      throw Boom.badRequest('No user ID provided');
    }

    try {
      const userImages = await UserImage.findAll({
        where: { userId },
        order: [['id', 'ASC']],
      });

      return userImages.length ? userImages : [];

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find user images' });
    }
  }
}