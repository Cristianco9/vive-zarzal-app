// import the age restriction data model
import { AgeRestriction } from '../db/models/ageRestrictionModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "AgeRestriction" catalog entity.
 *
 * Encapsulates all the business logic and database access related to
 * the age restrictions that can be applied to services. Every public
 * method resolves with the requested data or rejects with a normalized
 * Boom error, keeping the controllers thin.
 */
export class AgeRestrictionServices {

  /**
   * Creates a new age restriction record.
   *
   * @param {Object} newAgeRestriction - Data of the age restriction.
   * @param {string} newAgeRestriction.name - Unique name of the restriction.
   * @param {string} [newAgeRestriction.description] - Optional description.
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} Conflict if it already exists, internal error otherwise.
   */
  async createOne(newAgeRestriction) {

    try {
      // check whether an age restriction with the same name already exists
      const existingAgeRestriction = await AgeRestriction.findOne({
        where: { name: newAgeRestriction.name }
      });

      // if it exists, reject the insertion to keep names unique
      if (existingAgeRestriction) {
        throw Boom.conflict('Age restriction already exists');
      }

      // create a new record in the database
      await AgeRestriction.create({
        name: newAgeRestriction.name,
        description: newAgeRestriction.description,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new age restriction' });
    }
  }

  /**
   * Updates an existing age restriction by its identifier.
   *
   * @param {number} ageRestrictionId - Identifier of the record to update.
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest if no data is provided, NotFound if it does not exist.
   */
  async updateOne(ageRestrictionId, newData) {

    if (!newData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    try {
      // update the record in the database
      const [updatedRows] = await AgeRestriction.update(
        {
          name: newData.name,
          description: newData.description,
        },
        {
          where: { id: ageRestrictionId }
        }
      );

      // if no rows were affected, the record does not exist
      if (!updatedRows) {
        throw Boom.notFound('Age restriction not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update age restriction' });
    }
  }

  /**
   * Deletes an age restriction by its identifier.
   *
   * @param {number} ageRestrictionId - Identifier of the record to delete.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async deleteOne(ageRestrictionId) {

    if (!ageRestrictionId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No age restriction ID provided');
    }

    try {
      // destroy the record in the database
      const deletedRows = await AgeRestriction.destroy({
        where: { id: ageRestrictionId }
      });

      // if no rows were deleted, the record does not exist
      if (!deletedRows) {
        throw Boom.notFound('Age restriction not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete age restriction' });
    }
  }

  /**
   * Retrieves a single age restriction by its identifier.
   *
   * @param {number} ageRestrictionId - Identifier of the record to find.
   * @returns {Promise<Object>} The age restriction record.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async listOne(ageRestrictionId) {

    if (!ageRestrictionId) {
      throw Boom.badRequest('No age restriction ID provided');
    }

    try {
      const theAgeRestriction = await AgeRestriction.findOne({
        where: { id: ageRestrictionId }
      });

      if (!theAgeRestriction) {
        throw Boom.notFound('Age restriction not found');
      }

      return theAgeRestriction;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find age restriction' });
    }
  }

  /**
   * Retrieves every age restriction ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of age restrictions (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allAgeRestrictions = await AgeRestriction.findAll({
        order: [['id', 'ASC']]
      });

      // always return an array, even when there are no records
      return allAgeRestrictions.length ? allAgeRestrictions : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find age restrictions' });
    }
  }
}