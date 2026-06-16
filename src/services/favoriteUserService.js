// import the service favorite data model
import { ServiceFavorite } from '../db/models/favoriteUserServiceModel.js';
// import related models to validate foreign key relations
import { User } from '../db/models/userModel.js';
import { Service } from '../db/models/serviceModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "ServiceFavorite" junction entity.
 *
 * Represents the many-to-many relationship between users and the
 * services they mark as favorites. Each record links a user ("userId")
 * to a service ("serviceId"); the pair is unique, so a user cannot
 * favorite the same service twice. Both foreign keys are validated on
 * every write operation to preserve referential integrity.
 *
 * Association aliases (defined in setupAssociations):
 *   - user    -> ServiceFavorite.belongsTo(User)
 *   - service -> ServiceFavorite.belongsTo(Service)
 */
export class FavoriteUserServiceServices {

  /**
   * Creates a new favorite after validating its relations and uniqueness.
   *
   * @param {Object} newFavorite - Favorite data.
   * @param {number} newFavorite.userId - Owner user identifier.
   * @param {number} newFavorite.serviceId - Favorited service identifier.
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} NotFound if user/service do not exist, Conflict if duplicated.
   */
  async createOne(newFavorite) {

    try {
      // ensure the owner user exists
      const ownerUser = await User.findByPk(newFavorite.userId);
      if (!ownerUser) {
        throw Boom.notFound('User not found');
      }

      // ensure the favorited service exists
      const favoritedService = await Service.findByPk(newFavorite.serviceId);
      if (!favoritedService) {
        throw Boom.notFound('Service not found');
      }

      // prevent duplicates: the (user, service) pair must be unique
      const existingFavorite = await ServiceFavorite.findOne({
        where: {
          userId: newFavorite.userId,
          serviceId: newFavorite.serviceId,
        }
      });

      if (existingFavorite) {
        throw Boom.conflict('Service is already in the user favorites');
      }

      // create a new record in the database
      await ServiceFavorite.create({
        userId: newFavorite.userId,
        serviceId: newFavorite.serviceId,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new favorite' });
    }
  }

  /**
   * Deletes a favorite by its identifier.
   *
   * @param {number} favoriteId - Identifier of the record to delete.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async deleteOne(favoriteId) {

    if (!favoriteId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No favorite ID provided');
    }

    try {
      // destroy the record in the database
      const deletedRows = await ServiceFavorite.destroy({
        where: { id: favoriteId }
      });

      // if no rows were deleted, the record does not exist
      if (!deletedRows) {
        throw Boom.notFound('Favorite not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete favorite' });
    }
  }

  /**
   * Retrieves a single favorite, including its user and service.
   *
   * @param {number} favoriteId - Identifier of the favorite.
   * @returns {Promise<Object>} The favorite record with its relations.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async listOne(favoriteId) {

    if (!favoriteId) {
      throw Boom.badRequest('No favorite ID provided');
    }

    try {
      const theFavorite = await ServiceFavorite.findOne({
        where: { id: favoriteId },
        include: [
          { model: User, as: 'user' },
          { model: Service, as: 'service' },
        ],
      });

      if (!theFavorite) {
        throw Boom.notFound('Favorite not found');
      }

      return theFavorite;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find favorite' });
    }
  }

  /**
   * Retrieves every favorite ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of favorites (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allFavorites = await ServiceFavorite.findAll({
        order: [['id', 'ASC']],
        include: [
          { model: User, as: 'user' },
          { model: Service, as: 'service' },
        ],
      });

      // always return an array, even when there are no records
      return allFavorites.length ? allFavorites : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find favorites' });
    }
  }

  /**
   * Retrieves every favorite belonging to a specific user.
   *
   * @param {number} userId - Owner user identifier.
   * @returns {Promise<Object[]>} List of the user favorites (empty array if none).
   * @throws {Boom} BadRequest if no user id is provided, internal error otherwise.
   */
  async listAllByUser(userId) {

    if (!userId) {
      throw Boom.badRequest('No user ID provided');
    }

    try {
      const userFavorites = await ServiceFavorite.findAll({
        where: { userId },
        order: [['id', 'ASC']],
        include: [
          { model: Service, as: 'service' },
        ],
      });

      // always return an array, even when there are no records
      return userFavorites.length ? userFavorites : [];

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find user favorites' });
    }
  }
}