// import the department data model
import { Department } from '../db/models/departmentModel.js';
// import the country model to validate the foreign key relation
import { Country } from '../db/models/countryModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "Department" entity.
 *
 * A department always belongs to a country, therefore the parent
 * "countryId" is validated on every write operation.
 */
export class DepartmentServices {

  /**
   * Creates a new department associated with an existing country.
   *
   * @param {Object} newDepartment - Department data.
   * @param {number} newDepartment.countryId - Parent country identifier.
   * @param {string} newDepartment.name - Name of the department.
   * @param {string} [newDepartment.description] - Optional description.
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} NotFound if the country does not exist, Conflict if duplicated.
   */
  async createOne(newDepartment) {

    try {
      // ensure the parent country exists before creating the department
      const parentCountry = await Country.findByPk(newDepartment.countryId);

      if (!parentCountry) {
        throw Boom.notFound('Parent country not found');
      }

      // avoid duplicated departments within the same country
      const existingDepartment = await Department.findOne({
        where: {
          name: newDepartment.name,
          countryId: newDepartment.countryId,
        }
      });

      if (existingDepartment) {
        throw Boom.conflict('Department already exists in this country');
      }

      // create a new record in the database
      await Department.create({
        countryId: newDepartment.countryId,
        name: newDepartment.name,
        description: newDepartment.description,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new department' });
    }
  }

  /**
   * Updates an existing department.
   *
   * @param {number} departmentId - Identifier of the department to update.
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async updateOne(departmentId, newData) {

    if (!newData) {
      throw Boom.badRequest('No data provided');
    }

    try {
      // if the parent country is being changed, validate it exists
      if (newData.countryId) {
        const parentCountry = await Country.findByPk(newData.countryId);
        if (!parentCountry) {
          throw Boom.notFound('Parent country not found');
        }
      }

      const [updatedRows] = await Department.update(
        {
          countryId: newData.countryId,
          name: newData.name,
          description: newData.description,
        },
        {
          where: { id: departmentId }
        }
      );

      if (!updatedRows) {
        throw Boom.notFound('Department not found');
      }

      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update department' });
    }
  }

  /**
   * Deletes a department by its identifier.
   *
   * @param {number} departmentId - Identifier of the department to delete.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async deleteOne(departmentId) {

    if (!departmentId) {
      throw Boom.badRequest('No department ID provided');
    }

    try {
      const deletedRows = await Department.destroy({
        where: { id: departmentId }
      });

      if (!deletedRows) {
        throw Boom.notFound('Department not found');
      }

      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete department' });
    }
  }

  /**
   * Retrieves a single department, including its parent country.
   *
   * @param {number} departmentId - Identifier of the department.
   * @returns {Promise<Object>} The department record with its country.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async listOne(departmentId) {

    if (!departmentId) {
      throw Boom.badRequest('No department ID provided');
    }

    try {
      const theDepartment = await Department.findOne({
        where: { id: departmentId },
        include: [{ model: Country, as: 'country' }],
      });

      if (!theDepartment) {
        throw Boom.notFound('Department not found');
      }

      return theDepartment;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find department' });
    }
  }

  /**
   * Retrieves every department ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of departments (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allDepartments = await Department.findAll({
        order: [['id', 'ASC']],
        include: [{ model: Country, as: 'country' }],
      });

      return allDepartments.length ? allDepartments : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find departments' });
    }
  }
}