// import the role data model
import { Role } from '../db/models/roleModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "Role" catalog entity.
 *
 * Encapsulates all the business logic and database access related to the
 * roles a user can be assigned (e.g. admin, advertiser, client). Every
 * public method resolves with the requested data or rejects with a
 * normalized Boom error.
 */
export class RoleServices {

  /**
   * Creates a new role record.
   *
   * @param {Object} newRole - Data of the role.
   * @param {string} newRole.name - Unique name of the role.
   * @param {string} [newRole.description] - Optional description.
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} Conflict if it already exists, internal error otherwise.
   */
  async createOne(newRole) {

    try {
      // check whether a role with the same name already exists
      const existingRole = await Role.findOne({
        where: { name: newRole.name }
      });

      // if it exists, reject the insertion to keep names unique
      if (existingRole) {
        throw Boom.conflict('Role already exists');
      }

      // create a new record in the database
      await Role.create({
        name: newRole.name,
        description: newRole.description,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new role' });
    }
  }

  /**
   * Updates an existing role by its identifier.
   *
   * @param {number} roleId - Identifier of the record to update.
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest if no data is provided, NotFound if it does not exist.
   */
  async updateOne(roleId, newData) {

    if (!newData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    try {
      // update the record in the database
      const [updatedRows] = await Role.update(
        {
          name: newData.name,
          description: newData.description,
        },
        {
          where: { id: roleId }
        }
      );

      // if no rows were affected, the record does not exist
      if (!updatedRows) {
        throw Boom.notFound('Role not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update role' });
    }
  }

  /**
   * Deletes a role by its identifier.
   *
   * @param {number} roleId - Identifier of the record to delete.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async deleteOne(roleId) {

    if (!roleId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No role ID provided');
    }

    try {
      // destroy the record in the database
      const deletedRows = await Role.destroy({
        where: { id: roleId }
      });

      // if no rows were deleted, the record does not exist
      if (!deletedRows) {
        throw Boom.notFound('Role not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete role' });
    }
  }

  /**
   * Retrieves a single role by its identifier.
   *
   * @param {number} roleId - Identifier of the record to find.
   * @returns {Promise<Object>} The role record.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async listOne(roleId) {

    if (!roleId) {
      throw Boom.badRequest('No role ID provided');
    }

    try {
      const theRole = await Role.findOne({
        where: { id: roleId }
      });

      if (!theRole) {
        throw Boom.notFound('Role not found');
      }

      return theRole;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find role' });
    }
  }

  /**
   * Retrieves every role ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of roles (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allRoles = await Role.findAll({
        order: [['id', 'ASC']]
      });

      // always return an array, even when there are no records
      return allRoles.length ? allRoles : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find roles' });
    }
  }
}