// Import the ReservationServices class from the reservationServices module
import { ReservationServices } from '../../services/reservationServices.js';

/**
 * Controller — GET /reservations/service/:serviceId
 *
 * Retrieves all reservations associated with a specific service.
 * Returns 404 if the service does not exist.
 * Typically restricted to administrators or the business owner via middleware.
 *
 * @param {Object}   req  - Express request. Expects :serviceId in params.
 * @param {Object}   res  - Express response.
 * @param {Function} next - Next middleware (error handler).
 * @returns {Promise<void>} 200 JSON with the service's reservations.
 */
export const listReservationsByService = async (req, res, next) => {

  // Extract the service ID from the route parameters
  const { serviceId } = req.params;

  try {
    // Instantiate the service manager
    const reservationManager = new ReservationServices();

    // Retrieve all reservations for the given service
    const reservations = await reservationManager.listByService(Number(serviceId));

    return res.status(200).json({
      success: true,
      message: 'Reservations for the service retrieved successfully',
      data: reservations,
      authentication: res.locals.newUserToken,
    });

  } catch (error) {
    // Forward the Boom error (404) or any unexpected error
    next(error);
  }
};