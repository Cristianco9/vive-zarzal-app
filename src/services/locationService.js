// import the location data model
import { Location } from '../db/models/locationModel.js';
// import the city model to validate the foreign key relation
import { City } from '../db/models/cityModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "Location" entity.
 *
 * A location stores an address name, an optional description and code,
 * and is always tied to a city through "cityId". This model keeps
 * automatic timestamps (createdAt / updatedAt).
 */
export class LocationServices {

  /**
   * Creates a new location associated with an existing city.
   *
   * @param {Object} newLocation - Location data.
   * @param {number} newLocation.cityId - Parent city identifier.
   * @param {string} newLocation.name - Name of the location.
   * @param {string} [newLocation.description] - Optional long description.
   * @param {string} [newLocation.code] - Optional location code.
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} NotFound if the city does not exist, internal error otherwise.
   */
  async createOne(newLocation) {

    try {
      // ensure the parent city exists before creating the location
      const parentCity = await City.findByPk(newLocation.cityId);

      if (!parentCity) {
        throw Boom.notFound('Parent city not found');
      }

      // create a new record in the database
      await Location.create({
        cityId: newLocation.cityId,
        name: newLocation.name,
        description: newLocation.description,
        code: newLocation.code,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new location' });
    }
  }

  /**
   * Updates an existing location by its identifier.
   *
   * @param {number} locationId - Identifier of the location to update.
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async updateOne(locationId, newData) {

    if (!newData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    try {
      // if the parent city is being changed, validate it exists
      if (newData.cityId) {
        const parentCity = await City.findByPk(newData.cityId);
        if (!parentCity) {
          throw Boom.notFound('Parent city not found');
        }
      }

      // update the record in the database
      const [updatedRows] = await Location.update(
        {
          cityId: newData.cityId,
          name: newData.name,
          description: newData.description,
          code: newData.code,
        },
        {
          where: { id: locationId }
        }
      );

      // if no rows were affected, the location does not exist
      if (!updatedRows) {
        throw Boom.notFound('Location not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update location' });
    }
  }

  /**
   * Deletes a location by its identifier.
   *
   * @param {number} locationId - Identifier of the location to delete.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async deleteOne(locationId) {

    if (!locationId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No location ID provided');
    }

    try {
      // destroy the record in the database
      const deletedRows = await Location.destroy({
        where: { id: locationId }
      });

      // if no rows were deleted, the location does not exist
      if (!deletedRows) {
        throw Boom.notFound('Location not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete location' });
    }
  }

  /**
   * Retrieves a single location, including its parent city.
   *
   * @param {number} locationId - Identifier of the location.
   * @returns {Promise<Object>} The location record with its city.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async listOne(locationId) {

    if (!locationId) {
      throw Boom.badRequest('No location ID provided');
    }

    try {
      const theLocation = await Location.findOne({
        where: { id: locationId },
        include: [{ model: City, as: 'city' }],
      });

      if (!theLocation) {
        throw Boom.notFound('Location not found');
      }

      return theLocation;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find location' });
    }
  }

  /**
   * Retrieves every location ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of locations (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allLocations = await Location.findAll({
        order: [['id', 'ASC']],
        include: [{ model: City, as: 'city' }],
      });

      // always return an array, even when there are no records
      return allLocations.length ? allLocations : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find locations' });
    }
  }
}