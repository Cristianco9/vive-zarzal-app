// import the city data model
import { City } from '../db/models/cityModel.js';
// import the department model to validate the foreign key relation
import { Department } from '../db/models/departmentModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "City" entity.
 *
 * A city always belongs to a department, therefore the parent
 * "departmentId" is validated on every write operation.
 */
export class CityServices {

  /**
   * Creates a new city associated with an existing department.
   *
   * @param {Object} newCity - City data.
   * @param {number} newCity.departmentId - Parent department identifier.
   * @param {string} newCity.name - Name of the city.
   * @param {string} [newCity.description] - Optional description.
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} NotFound if the department does not exist, Conflict if duplicated.
   */
  async createOne(newCity) {

    try {
      // ensure the parent department exists before creating the city
      const parentDepartment = await Department.findByPk(newCity.departmentId);

      if (!parentDepartment) {
        throw Boom.notFound('Parent department not found');
      }

      // avoid duplicated cities within the same department
      const existingCity = await City.findOne({
        where: {
          name: newCity.name,
          departmentId: newCity.departmentId,
        }
      });

      if (existingCity) {
        throw Boom.conflict('City already exists in this department');
      }

      await City.create({
        departmentId: newCity.departmentId,
        name: newCity.name,
        description: newCity.description,
      });

      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new city' });
    }
  }

  /**
   * Updates an existing city.
   *
   * @param {number} cityId - Identifier of the city to update.
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async updateOne(cityId, newData) {

    if (!newData) {
      throw Boom.badRequest('No data provided');
    }

    try {
      // if the parent department is being changed, validate it exists
      if (newData.departmentId) {
        const parentDepartment = await Department.findByPk(newData.departmentId);
        if (!parentDepartment) {
          throw Boom.notFound('Parent department not found');
        }
      }

      const [updatedRows] = await City.update(
        {
          departmentId: newData.departmentId,
          name: newData.name,
          description: newData.description,
        },
        {
          where: { id: cityId }
        }
      );

      if (!updatedRows) {
        throw Boom.notFound('City not found');
      }

      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update city' });
    }
  }

  /**
   * Deletes a city by its identifier.
   *
   * @param {number} cityId - Identifier of the city to delete.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async deleteOne(cityId) {

    if (!cityId) {
      throw Boom.badRequest('No city ID provided');
    }

    try {
      const deletedRows = await City.destroy({
        where: { id: cityId }
      });

      if (!deletedRows) {
        throw Boom.notFound('City not found');
      }

      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete city' });
    }
  }

  /**
   * Retrieves a single city, including its parent department.
   *
   * @param {number} cityId - Identifier of the city.
   * @returns {Promise<Object>} The city record with its department.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async listOne(cityId) {

    if (!cityId) {
      throw Boom.badRequest('No city ID provided');
    }

    try {
      const theCity = await City.findOne({
        where: { id: cityId },
        include: [{ model: Department, as: 'department' }],
      });

      if (!theCity) {
        throw Boom.notFound('City not found');
      }

      return theCity;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find city' });
    }
  }

  /**
   * Retrieves every city ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of cities (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allCities = await City.findAll({
        order: [['id', 'ASC']],
        include: [{ model: Department, as: 'department' }],
      });

      return allCities.length ? allCities : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find cities' });
    }
  }
}