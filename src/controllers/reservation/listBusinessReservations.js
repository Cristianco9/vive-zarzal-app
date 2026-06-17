// Import the ReservationServices class from the reservationServices module
import { ReservationServices } from '../../services/reservationService.js';

/**
 * Controller — GET /reservations/business/:businessId
 *
 * Retrieves all reservations linked to any service that belongs to the
 * given business. The chain traversed is:
 *   Business → Service (businessId) → Reservation (serviceId)
 *
 * Returns 404 if the business does not exist.
 * Typically restricted to administrators or the business owner via middleware.
 *
 * @param {Object}   req  - Express request. Expects :businessId in params.
 * @param {Object}   res  - Express response.
 * @param {Function} next - Next middleware (error handler).
 * @returns {Promise<void>} 200 JSON with the business's reservations.
 */
export const listReservationsByBusiness = async (req, res, next) => {

  // Extract the business ID from the route parameters
  const { businessId } = req.params;

  try {
    // Instantiate the service manager
    const reservationManager = new ReservationServices();

    // Retrieve all reservations across every service of the given business
    const reservations = await reservationManager.listByBusiness(Number(businessId));

    return res.status(200).json({
      success: true,
      message: 'Reservations for the business retrieved successfully',
      data: reservations,
      authentication: res.locals.newUserToken,
    });

  } catch (error) {
    // Forward the Boom error (404) or any unexpected error
    next(error);
  }
};