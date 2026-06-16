// import the reservation data model
import { Reservation } from '../db/models/reservationModel.js';
// import the service model to validate the foreign key relation
import { Service } from '../db/models/serviceModel.js';
// import the reservation detail model to expose its related details
import { ReservationDetail } from '../db/models/reservationDetailsModel.js';
// import the user model to validate ownership
import { User } from '../db/models/userModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "Reservation" entity.
 *
 * A reservation is always tied to a service through "serviceId". Its
 * lifecycle (status, user, etc.) is tracked through the related
 * ReservationDetail records. The foreign key is validated on every
 * write operation to preserve referential integrity.
 *
 * Association aliases (defined in setupAssociations):
 *   - service -> Reservation.belongsTo(Service)
 *   - details -> Reservation.hasMany(ReservationDetail)
 */
export class ReservationServices {

  /**
   * Creates a new reservation associated with an existing service.
   *
   * @param {Object} newReservation - Reservation data.
   * @param {number} newReservation.serviceId - Parent service identifier.
   * @param {number} userId - ID of the user creating the reservation.
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} NotFound if the service does not exist, internal error otherwise.
   */
  async createOne(newReservation, userId) {

    try {
      // ensure the parent service exists before creating the reservation
      const parentService = await Service.findByPk(newReservation.serviceId);

      if (!parentService) {
        throw Boom.notFound('Parent service not found');
      }

      // create a new record in the database
      const reservation = await Reservation.create({
        serviceId: newReservation.serviceId,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY', reservationId: reservation.id };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new reservation' });
    }
  }

  /**
   * Updates an existing reservation by its identifier.
   *
   * @param {number} reservationId - Identifier of the reservation to update.
   * @param {Object} newData - New values to persist.
   * @param {number} userId - ID of the user attempting the update.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async updateOne(reservationId, newData, userId) {

    if (!newData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    try {
      // find the reservation with its details to check ownership
      const reservation = await Reservation.findOne({
        where: { id: reservationId },
        include: [{ model: ReservationDetail, as: 'details' }]
      });

      if (!reservation) {
        throw Boom.notFound('Reservation not found');
      }

      // check if user owns this reservation
      const isOwner = reservation.details.some(detail => detail.userId === userId);
      if (!isOwner) {
        throw Boom.forbidden('User not authorized to update this reservation');
      }

      // if the parent service is being changed, validate it exists
      if (newData.serviceId) {
        const parentService = await Service.findByPk(newData.serviceId);
        if (!parentService) {
          throw Boom.notFound('Parent service not found');
        }
      }

      // update the record in the database
      const [updatedRows] = await Reservation.update(
        {
          serviceId: newData.serviceId,
        },
        {
          where: { id: reservationId }
        }
      );

      // if no rows were affected, the reservation does not exist
      if (!updatedRows) {
        throw Boom.notFound('Reservation not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update reservation' });
    }
  }

  /**
   * Deletes a reservation by its identifier.
   *
   * @param {number} reservationId - Identifier of the reservation to delete.
   * @param {number} userId - ID of the user attempting the deletion.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async deleteOne(reservationId, userId) {

    if (!reservationId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No reservation ID provided');
    }

    try {
      // find the reservation with its details to check ownership
      const reservation = await Reservation.findOne({
        where: { id: reservationId },
        include: [{ model: ReservationDetail, as: 'details' }]
      });

      if (!reservation) {
        throw Boom.notFound('Reservation not found');
      }

      // check if user owns this reservation
      const isOwner = reservation.details.some(detail => detail.userId === userId);
      if (!isOwner) {
        throw Boom.forbidden('User not authorized to delete this reservation');
      }

      // destroy the record in the database
      const deletedRows = await Reservation.destroy({
        where: { id: reservationId }
      });

      // if no rows were deleted, the reservation does not exist
      if (!deletedRows) {
        throw Boom.notFound('Reservation not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete reservation' });
    }
  }

  /**
   * Retrieves a single reservation, including its service and details.
   *
   * @param {number} reservationId - Identifier of the reservation.
   * @param {number} userId - ID of the user requesting the reservation.
   * @returns {Promise<Object>} The reservation record with its relations.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async listOne(reservationId, userId) {

    if (!reservationId) {
      throw Boom.badRequest('No reservation ID provided');
    }

    try {
      const theReservation = await Reservation.findOne({
        where: { id: reservationId },
        include: [
          { model: Service, as: 'service' },
          { model: ReservationDetail, as: 'details' },
        ],
      });

      if (!theReservation) {
        throw Boom.notFound('Reservation not found');
      }

      // check if user owns this reservation
      const isOwner = theReservation.details.some(detail => detail.userId === userId);
      if (!isOwner) {
        throw Boom.forbidden('User not authorized to access this reservation');
      }

      return theReservation;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find reservation' });
    }
  }

  /**
   * Retrieves reservations belonging to the specified user.
   *
   * @param {number} userId - ID of the user whose reservations to retrieve.
   * @returns {Promise<Object[]>} List of user's reservations (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listUserReservations(userId) {

    try {
      // Find all reservations that have details associated with the user
      const userReservations = await Reservation.findAll({
        include: [
          { 
            model: ReservationDetail, 
            as: 'details',
            where: { userId: userId }
          },
          { model: Service, as: 'service' }
        ],
        order: [['id', 'ASC']]
      });

      // always return an array, even when there are no records
      return userReservations.length ? userReservations : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find user reservations' });
    }
  }

  /**
   * Retrieves every reservation ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of reservations (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allReservations = await Reservation.findAll({
        order: [['id', 'ASC']],
        include: [
          { model: Service, as: 'service' },
          { model: ReservationDetail, as: 'details' },
        ],
      });

      // always return an array, even when there are no records
      return allReservations.length ? allReservations : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find reservations' });
    }
  }
}