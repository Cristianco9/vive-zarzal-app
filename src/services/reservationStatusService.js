// import the reservation status data model
import { ReservationStatus } from '../db/models/reserveStatusModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "ReservationStatus" catalog entity.
 *
 * Encapsulates all the business logic and database access related to
 * the statuses a reservation can have. Every public method resolves
 * with the requested data or rejects with a normalized Boom error.
 */
export class ReservationStatusServices {

  /**
   * Creates a new reservation status record.
   *
   * @param {Object} newReservationStatus - Data of the reservation status.
   * @param {string} newReservationStatus.name - Unique name of the status.
   * @param {string} [newReservationStatus.description] - Optional description.
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} Conflict if it already exists, internal error otherwise.
   */
  async createOne(newReservationStatus) {

    try {
      // check whether a status with the same name already exists
      const existingReservationStatus = await ReservationStatus.findOne({
        where: { name: newReservationStatus.name }
      });

      // if it exists, reject the insertion to keep names unique
      if (existingReservationStatus) {
        throw Boom.conflict('Reservation status already exists');
      }

      // create a new record in the database
      await ReservationStatus.create({
        name: newReservationStatus.name,
        description: newReservationStatus.description,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new reservation status' });
    }
  }

  /**
   * Updates an existing reservation status by its identifier.
   *
   * @param {number} reservationStatusId - Identifier of the record to update.
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest if no data is provided, NotFound if it does not exist.
   */
  async updateOne(reservationStatusId, newData) {

    if (!newData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    try {
      // update the record in the database
      const [updatedRows] = await ReservationStatus.update(
        {
          name: newData.name,
          description: newData.description,
        },
        {
          where: { id: reservationStatusId }
        }
      );

      // if no rows were affected, the record does not exist
      if (!updatedRows) {
        throw Boom.notFound('Reservation status not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update reservation status' });
    }
  }

  /**
   * Deletes a reservation status by its identifier.
   *
   * @param {number} reservationStatusId - Identifier of the record to delete.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async deleteOne(reservationStatusId) {

    if (!reservationStatusId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No reservation status ID provided');
    }

    try {
      // destroy the record in the database
      const deletedRows = await ReservationStatus.destroy({
        where: { id: reservationStatusId }
      });

      // if no rows were deleted, the record does not exist
      if (!deletedRows) {
        throw Boom.notFound('Reservation status not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete reservation status' });
    }
  }

  /**
   * Retrieves a single reservation status by its identifier.
   *
   * @param {number} reservationStatusId - Identifier of the record to find.
   * @returns {Promise<Object>} The reservation status record.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async listOne(reservationStatusId) {

    if (!reservationStatusId) {
      throw Boom.badRequest('No reservation status ID provided');
    }

    try {
      const theReservationStatus = await ReservationStatus.findOne({
        where: { id: reservationStatusId }
      });

      if (!theReservationStatus) {
        throw Boom.notFound('Reservation status not found');
      }

      return theReservationStatus;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find reservation status' });
    }
  }

  /**
   * Retrieves every reservation status ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of reservation statuses (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allReservationStatuses = await ReservationStatus.findAll({
        order: [['id', 'ASC']]
      });

      // always return an array, even when there are no records
      return allReservationStatuses.length ? allReservationStatuses : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find reservation statuses' });
    }
  }
}