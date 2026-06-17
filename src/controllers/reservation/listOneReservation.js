// Import the ReservationServices class from the reservationServices module
import { ReservationServices } from '../../services/reservationService.js';

/**
 * Controller — GET /reservations/:id
 *
 * Retrieves a single reservation with its service and detail records.
 * Only the owner of the reservation may access it; the service layer
 * returns 403 if the calling user has no matching ReservationDetail row.
 *
 * @param {Object}   req  - Express request. Expects :id in params.
 * @param {Object}   res  - Express response.
 * @param {Function} next - Next middleware (error handler).
 * @returns {Promise<void>} 200 JSON with the reservation data.
 */
export const listOneReservation = async (req, res, next) => {

  // Extract the reservation ID from the route parameters
  const { id } = req.params;

  // Extract the authenticated user's ID from the JWT token
  const userId = req.user.id;

  try {
    // Instantiate the service manager
    const reservationManager = new ReservationServices();

    // Delegate the lookup to the service layer (ownership is enforced there)
    const reservation = await reservationManager.listOne(Number(id), userId);

    return res.status(200).json({
      success: true,
      message: 'Reservation retrieved successfully',
      data: reservation,
      authentication: res.locals.newUserToken,
    });

  } catch (error) {
    // Forward the Boom error (400 / 403 / 404) or any unexpected error
    next(error);
  }
};