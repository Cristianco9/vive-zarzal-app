// import the country data model
import { Country } from '../db/models/countryModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "Country" entity.
 *
 * Encapsulates all the business logic and database access related to
 * countries. Every public method resolves with the requested data or
 * rejects with a normalized Boom error, keeping the controllers thin.
 */
export class CountryServices {

  /**
   * Creates a new country record.
   *
   * @param {Object} newCountry - Data of the country to be created.
   * @param {string} newCountry.name - Unique name of the country.
   * @param {string} [newCountry.description] - Optional description.
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} Conflict if the country already exists, internal error otherwise.
   */
  async createOne(newCountry) {

    try {
      // check whether a country with the same name already exists
      const existingCountry = await Country.findOne({
        where: { name: newCountry.name }
      });

      // if it exists, reject the insertion to keep names unique
      if (existingCountry) {
        throw Boom.conflict('Country already exists');
      }

      // create a new record in the database
      await Country.create({
        name: newCountry.name,
        description: newCountry.description,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new country' });
    }
  }

  /**
   * Updates an existing country by its identifier.
   *
   * @param {number} countryId - Identifier of the country to update.
   * @param {Object} newCountryData - New data to be persisted.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest if no data is provided, NotFound if it does not exist.
   */
  async updateOne(countryId, newCountryData) {

    if (!newCountryData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    try {
      // update the record in the database
      const [updatedRows] = await Country.update(
        {
          name: newCountryData.name,
          description: newCountryData.description,
        },
        {
          where: { id: countryId }
        }
      );

      // if no rows were affected, the country does not exist
      if (!updatedRows) {
        throw Boom.notFound('Country not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update country' });
    }
  }

  /**
   * Deletes a country by its identifier.
   *
   * @param {number} countryId - Identifier of the country to delete.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async deleteOne(countryId) {

    if (!countryId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No country ID provided');
    }

    try {
      // destroy the record in the database
      const deletedRows = await Country.destroy({
        where: { id: countryId }
      });

      // if no rows were deleted, the country does not exist
      if (!deletedRows) {
        throw Boom.notFound('Country not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete country' });
    }
  }

  /**
   * Retrieves a single country by its identifier.
   *
   * @param {number} countryId - Identifier of the country to find.
   * @returns {Promise<Object>} The country record.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async listOne(countryId) {

    if (!countryId) {
      throw Boom.badRequest('No country ID provided');
    }

    try {
      const theCountry = await Country.findOne({
        where: { id: countryId }
      });

      if (!theCountry) {
        throw Boom.notFound('Country not found');
      }

      return theCountry;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find country' });
    }
  }

  /**
   * Retrieves every country ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of countries (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allCountries = await Country.findAll({
        order: [['id', 'ASC']]
      });

      // always return an array, even when there are no records
      return allCountries.length ? allCountries : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find countries' });
    }
  }
}