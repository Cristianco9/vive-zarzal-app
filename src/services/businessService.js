// import the business data model
import { Business } from '../db/models/businessModel.js';
// import related models to validate foreign key relations
import { User } from '../db/models/userModel.js';
import { Location } from '../db/models/locationModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "Business" entity.
 *
 * A business is owned by exactly one user ("ownerUserId") and may
 * optionally be tied to a location ("locationId"). Both foreign keys
 * are validated on every write operation to preserve referential
 * integrity.
 */
export class BusinessServices {

  /**
   * Creates a new business owned by an existing user.
   *
   * @param {Object} newBusiness - Business data.
   * @param {number} newBusiness.ownerUserId - Owner user identifier (required).
   * @param {number} [newBusiness.locationId] - Optional location identifier.
   * @param {string} newBusiness.name - Business name.
   * @param {string} [newBusiness.description] - Optional description.
   * @param {string} [newBusiness.facebook] - Optional Facebook page.
   * @param {string} [newBusiness.instagram] - Optional Instagram profile.
   * @param {string} [newBusiness.tiktok] - Optional TikTok profile.
   * @param {string} [newBusiness.website] - Optional website.
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} NotFound if owner/location do not exist, internal error otherwise.
   */
  async createOne(newBusiness) {

    try {
      // ensure the owner user exists before creating the business
      const ownerUser = await User.findByPk(newBusiness.ownerUserId);

      if (!ownerUser) {
        throw Boom.notFound('Owner user not found');
      }

      // if a location is provided, ensure it exists
      if (newBusiness.locationId) {
        const parentLocation = await Location.findByPk(newBusiness.locationId);
        if (!parentLocation) {
          throw Boom.notFound('Location not found');
        }
      }

      // create a new record in the database
      await Business.create({
        ownerUserId: newBusiness.ownerUserId,
        locationId: newBusiness.locationId,
        name: newBusiness.name,
        description: newBusiness.description,
        facebook: newBusiness.facebook,
        instagram: newBusiness.instagram,
        tiktok: newBusiness.tiktok,
        website: newBusiness.website,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new business' });
    }
  }

  /**
   * Updates an existing business by its identifier.
   *
   * @param {number} businessId - Identifier of the business to update.
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async updateOne(businessId, newData) {

    if (!newData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    try {
      // if the owner is being changed, validate the user exists
      if (newData.ownerUserId) {
        const ownerUser = await User.findByPk(newData.ownerUserId);
        if (!ownerUser) {
          throw Boom.notFound('Owner user not found');
        }
      }

      // if the location is being changed, validate it exists
      if (newData.locationId) {
        const parentLocation = await Location.findByPk(newData.locationId);
        if (!parentLocation) {
          throw Boom.notFound('Location not found');
        }
      }

      // update the record in the database
      const [updatedRows] = await Business.update(
        {
          ownerUserId: newData.ownerUserId,
          locationId: newData.locationId,
          name: newData.name,
          description: newData.description,
          facebook: newData.facebook,
          instagram: newData.instagram,
          tiktok: newData.tiktok,
          website: newData.website,
        },
        {
          where: { id: businessId }
        }
      );

      // if no rows were affected, the business does not exist
      if (!updatedRows) {
        throw Boom.notFound('Business not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update business' });
    }
  }

  /**
   * Deletes a business by its identifier.
   *
   * @param {number} businessId - Identifier of the business to delete.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async deleteOne(businessId) {

    if (!businessId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No business ID provided');
    }

    try {
      // destroy the record in the database
      const deletedRows = await Business.destroy({
        where: { id: businessId }
      });

      // if no rows were deleted, the business does not exist
      if (!deletedRows) {
        throw Boom.notFound('Business not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete business' });
    }
  }

  /**
   * Retrieves a single business, including its owner and location.
   *
   * @param {number} businessId - Identifier of the business.
   * @returns {Promise<Object>} The business record with its relations.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async listOne(businessId) {

    if (!businessId) {
      throw Boom.badRequest('No business ID provided');
    }

    try {
      const theBusiness = await Business.findOne({
        where: { id: businessId },
        include: [
          { model: User, as: 'owner' },
          { model: Location, as: 'location' },
        ],
      });

      if (!theBusiness) {
        throw Boom.notFound('Business not found');
      }

      return theBusiness;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find business' });
    }
  }

  /**
   * Retrieves every business ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of businesses (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allBusinesses = await Business.findAll({
        order: [['id', 'ASC']],
        include: [
          { model: User, as: 'owner' },
          { model: Location, as: 'location' },
        ],
      });

      // always return an array, even when there are no records
      return allBusinesses.length ? allBusinesses : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find businesses' });
    }
  }
}