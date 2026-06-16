// import the gender data model
import { Gender } from '../db/models/genderModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "Gender" catalog entity.
 *
 * Encapsulates all the business logic and database access related to the
 * genders a user can be assigned. Every public method resolves with the
 * requested data or rejects with a normalized Boom error.
 */
export class GenderServices {

  /**
   * Creates a new gender record.
   *
   * @param {Object} newGender - Data of the gender.
   * @param {string} newGender.name - Unique name of the gender.
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} Conflict if it already exists, internal error otherwise.
   */
  async createOne(newGender) {

    try {
      // check whether a gender with the same name already exists
      const existingGender = await Gender.findOne({
        where: { name: newGender.name }
      });

      // if it exists, reject the insertion to keep names unique
      if (existingGender) {
        throw Boom.conflict('Gender already exists');
      }

      // create a new record in the database
      await Gender.create({
        name: newGender.name,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new gender' });
    }
  }

  /**
   * Updates an existing gender by its identifier.
   *
   * @param {number} genderId - Identifier of the record to update.
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest if no data is provided, NotFound if it does not exist.
   */
  async updateOne(genderId, newData) {

    if (!newData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    try {
      // update the record in the database
      const [updatedRows] = await Gender.update(
        {
          name: newData.name,
        },
        {
          where: { id: genderId }
        }
      );

      // if no rows were affected, the record does not exist
      if (!updatedRows) {
        throw Boom.notFound('Gender not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update gender' });
    }
  }

  /**
   * Deletes a gender by its identifier.
   *
   * @param {number} genderId - Identifier of the record to delete.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async deleteOne(genderId) {

    if (!genderId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No gender ID provided');
    }

    try {
      // destroy the record in the database
      const deletedRows = await Gender.destroy({
        where: { id: genderId }
      });

      // if no rows were deleted, the record does not exist
      if (!deletedRows) {
        throw Boom.notFound('Gender not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete gender' });
    }
  }

  /**
   * Retrieves a single gender by its identifier.
   *
   * @param {number} genderId - Identifier of the record to find.
   * @returns {Promise<Object>} The gender record.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async listOne(genderId) {

    if (!genderId) {
      throw Boom.badRequest('No gender ID provided');
    }

    try {
      const theGender = await Gender.findOne({
        where: { id: genderId }
      });

      if (!theGender) {
        throw Boom.notFound('Gender not found');
      }

      return theGender;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find gender' });
    }
  }

  /**
   * Retrieves every gender ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of genders (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allGenders = await Gender.findAll({
        order: [['id', 'ASC']]
      });

      // always return an array, even when there are no records
      return allGenders.length ? allGenders : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find genders' });
    }
  }
}