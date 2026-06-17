// import the reservation data model
import { Reservation } from '../db/models/reservationModel.js';
// import the service model to validate the foreign key relation and traverse to business
import { Service } from '../db/models/serviceModel.js';
// import the business model to filter reservations by business
import { Business } from '../db/models/businessModel.js';
// import the reservation detail model to expose its related details and check ownership
import { ReservationDetail } from '../db/models/reservationDetailsModel.js';
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
 * Ownership rule: a user owns a reservation when at least one
 * ReservationDetail row linked to that reservation carries their userId.
 *
 * Association aliases (defined in setupAssociations):
 *   - service  → Reservation.belongsTo(Service)
 *   - details  → Reservation.hasMany(ReservationDetail)
 *   - services → Business.hasMany(Service)
 */
export class ReservationServices {

  // ─── Private helpers ────────────────────────────────────────────────────────

  /**
   * Resolves and validates that a reservation exists.
   * Optionally enforces that the calling user is its owner.
   *
   * @param {number}  reservationId - Reservation to look up.
   * @param {number}  userId        - Caller's user ID.
   * @param {boolean} checkOwner    - When true, throws 403 if the user is not the owner.
   * @returns {Promise<Reservation>} The found reservation instance (with details included).
   * @throws {Boom} NotFound if missing, Forbidden if not the owner.
   */
  async #findAndCheckOwnership(reservationId, userId, checkOwner = true) {

    const reservation = await Reservation.findOne({
      where: { id: reservationId },
      include: [{ model: ReservationDetail, as: 'details' }],
    });

    if (!reservation) {
      throw Boom.notFound('Reservation not found');
    }

    if (checkOwner) {
      const isOwner = reservation.details.some(d => d.userId === userId);
      if (!isOwner) {
        throw Boom.forbidden('User not authorized to access this reservation');
      }
    }

    return reservation;
  }

  // ─── Write operations ────────────────────────────────────────────────────────

  /**
   * Creates a new reservation associated with an existing service.
   *
   * @param {Object} newReservation          - Reservation data.
   * @param {number} newReservation.serviceId - Parent service identifier.
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} NotFound if the service does not exist, internal error otherwise.
   */
  async createOne(newReservation) {

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

      return { status: 'CREATED SUCCESSFULLY', reservationId: reservation.id };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new reservation' });
    }
  }

  /**
   * Updates an existing reservation.
   * Only the owner of the reservation (identified via ReservationDetail.userId)
   * is allowed to perform this operation.
   *
   * @param {number} reservationId - Identifier of the reservation to update.
   * @param {Object} newData       - New values to persist.
   * @param {number} userId        - ID of the user attempting the update.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest, NotFound, Forbidden or internal error.
   */
  async updateOne(reservationId, newData, userId) {

    if (!newData) {
      throw Boom.badRequest('No data provided');
    }

    try {
      // verify existence and ownership before mutating
      await this.#findAndCheckOwnership(reservationId, userId);

      // if the parent service is being changed, validate it exists
      if (newData.serviceId) {
        const parentService = await Service.findByPk(newData.serviceId);
        if (!parentService) {
          throw Boom.notFound('Parent service not found');
        }
      }

      const [updatedRows] = await Reservation.update(
        { serviceId: newData.serviceId },
        { where: { id: reservationId } }
      );

      if (!updatedRows) {
        throw Boom.notFound('Reservation not found');
      }

      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update reservation' });
    }
  }

  /**
   * Deletes a reservation.
   * Only the owner of the reservation (identified via ReservationDetail.userId)
   * is allowed to perform this operation.
   *
   * @param {number} reservationId - Identifier of the reservation to delete.
   * @param {number} userId        - ID of the user attempting the deletion.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest, NotFound, Forbidden or internal error.
   */
  async deleteOne(reservationId, userId) {

    if (!reservationId) {
      throw Boom.badRequest('No reservation ID provided');
    }

    try {
      // verify existence and ownership before mutating
      await this.#findAndCheckOwnership(reservationId, userId);

      const deletedRows = await Reservation.destroy({
        where: { id: reservationId }
      });

      if (!deletedRows) {
        throw Boom.notFound('Reservation not found');
      }

      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete reservation' });
    }
  }

  // ─── Read operations ─────────────────────────────────────────────────────────

  /**
   * Retrieves a single reservation, including its service and details.
   * Only the owner of the reservation may access it.
   *
   * @param {number} reservationId - Identifier of the reservation.
   * @param {number} userId        - ID of the user requesting the reservation.
   * @returns {Promise<Reservation>} The reservation record with its relations.
   * @throws {Boom} BadRequest, NotFound, Forbidden or internal error.
   */
  async listOne(reservationId, userId) {

    if (!reservationId) {
      throw Boom.badRequest('No reservation ID provided');
    }

    try {
      const reservation = await Reservation.findOne({
        where: { id: reservationId },
        include: [
          { model: Service, as: 'service' },
          { model: ReservationDetail, as: 'details' },
        ],
      });

      if (!reservation) {
        throw Boom.notFound('Reservation not found');
      }

      const isOwner = reservation.details.some(d => d.userId === userId);
      if (!isOwner) {
        throw Boom.forbidden('User not authorized to access this reservation');
      }

      return reservation;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find reservation' });
    }
  }

  /**
   * Retrieves all reservations that belong to the given user.
   * A reservation belongs to the user when at least one of its
   * ReservationDetail rows carries their userId.
   *
   * @param {number} userId - ID of the user whose reservations to retrieve.
   * @returns {Promise<Reservation[]>} List of reservations (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listUserReservations(userId) {

    try {
      const userReservations = await Reservation.findAll({
        include: [
          {
            model: ReservationDetail,
            as: 'details',
            where: { userId },  // inner join — only reservations owned by this user
          },
          { model: Service, as: 'service' },
        ],
        order: [['id', 'ASC']],
      });

      return userReservations.length ? userReservations : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find user reservations' });
    }
  }

  /**
   * Retrieves all reservations associated with a specific service.
   * Validates that the service exists before querying.
   *
   * @param {number} serviceId - ID of the service whose reservations to retrieve.
   * @returns {Promise<Reservation[]>} List of reservations (empty array if none).
   * @throws {Boom} NotFound if the service does not exist, internal error otherwise.
   */
  async listByService(serviceId) {

    try {
      const parentService = await Service.findByPk(serviceId);

      if (!parentService) {
        throw Boom.notFound('Service not found');
      }

      const reservations = await Reservation.findAll({
        where: { serviceId },
        include: [
          { model: Service, as: 'service' },
          { model: ReservationDetail, as: 'details' },
        ],
        order: [['id', 'ASC']],
      });

      return reservations.length ? reservations : [];

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find reservations for this service' });
    }
  }

  /**
   * Retrieves all reservations linked to any service that belongs to a business.
   * Validates that the business exists before querying.
   *
   * Chain: Business → Service (businessId) → Reservation (serviceId)
   *
   * @param {number} businessId - ID of the business whose reservations to retrieve.
   * @returns {Promise<Reservation[]>} List of reservations (empty array if none).
   * @throws {Boom} NotFound if the business does not exist, internal error otherwise.
   */
  async listByBusiness(businessId) {

    try {
      const parentBusiness = await Business.findByPk(businessId);

      if (!parentBusiness) {
        throw Boom.notFound('Business not found');
      }

      const reservations = await Reservation.findAll({
        include: [
          {
            model: Service,
            as: 'service',
            where: { businessId },  // inner join — only services of this business
            include: [
              { model: Business, as: 'business' },
            ],
          },
          { model: ReservationDetail, as: 'details' },
        ],
        order: [['id', 'ASC']],
      });

      return reservations.length ? reservations : [];

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find reservations for this business' });
    }
  }

  /**
   * Retrieves every reservation ordered by id ascending.
   * Admin-only operation — no ownership filter is applied.
   *
   * @returns {Promise<Reservation[]>} List of all reservations (empty array if none).
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

      return allReservations.length ? allReservations : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find reservations' });
    }
  }
}