// import the service status data model
import { ServiceStatus } from '../db/models/serviceStatusModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "ServiceStatus" catalog entity.
 *
 * Encapsulates all the business logic and database access related to
 * the statuses a service can have. Every public method resolves with
 * the requested data or rejects with a normalized Boom error.
 */
export class ServiceStatusServices {

  /**
   * Creates a new service status record.
   *
   * @param {Object} newServiceStatus - Data of the service status.
   * @param {string} newServiceStatus.name - Unique name of the status.
   * @param {string} [newServiceStatus.description] - Optional description.
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} Conflict if it already exists, internal error otherwise.
   */
  async createOne(newServiceStatus) {

    try {
      // check whether a service status with the same name already exists
      const existingServiceStatus = await ServiceStatus.findOne({
        where: { name: newServiceStatus.name }
      });

      // if it exists, reject the insertion to keep names unique
      if (existingServiceStatus) {
        throw Boom.conflict('Service status already exists');
      }

      // create a new record in the database
      await ServiceStatus.create({
        name: newServiceStatus.name,
        description: newServiceStatus.description,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new service status' });
    }
  }

  /**
   * Updates an existing service status by its identifier.
   *
   * @param {number} serviceStatusId - Identifier of the record to update.
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest if no data is provided, NotFound if it does not exist.
   */
  async updateOne(serviceStatusId, newData) {

    if (!newData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    try {
      // update the record in the database
      const [updatedRows] = await ServiceStatus.update(
        {
          name: newData.name,
          description: newData.description,
        },
        {
          where: { id: serviceStatusId }
        }
      );

      // if no rows were affected, the record does not exist
      if (!updatedRows) {
        throw Boom.notFound('Service status not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update service status' });
    }
  }

  /**
   * Deletes a service status by its identifier.
   *
   * @param {number} serviceStatusId - Identifier of the record to delete.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async deleteOne(serviceStatusId) {

    if (!serviceStatusId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No service status ID provided');
    }

    try {
      // destroy the record in the database
      const deletedRows = await ServiceStatus.destroy({
        where: { id: serviceStatusId }
      });

      // if no rows were deleted, the record does not exist
      if (!deletedRows) {
        throw Boom.notFound('Service status not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete service status' });
    }
  }

  /**
   * Retrieves a single service status by its identifier.
   *
   * @param {number} serviceStatusId - Identifier of the record to find.
   * @returns {Promise<Object>} The service status record.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async listOne(serviceStatusId) {

    if (!serviceStatusId) {
      throw Boom.badRequest('No service status ID provided');
    }

    try {
      const theServiceStatus = await ServiceStatus.findOne({
        where: { id: serviceStatusId }
      });

      if (!theServiceStatus) {
        throw Boom.notFound('Service status not found');
      }

      return theServiceStatus;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find service status' });
    }
  }

  /**
   * Retrieves every service status ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of service statuses (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allServiceStatuses = await ServiceStatus.findAll({
        order: [['id', 'ASC']]
      });

      // always return an array, even when there are no records
      return allServiceStatuses.length ? allServiceStatuses : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find service statuses' });
    }
  }
}