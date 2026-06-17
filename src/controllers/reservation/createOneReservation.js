// Import the ReservationServices class from the reservationServices module
import { ReservationServices } from '../../services/reservationServices.js';

/**
 * Controller — POST /reservations
 *
 * Creates a new reservation and its initial detail record (status: pendiente).
 * The authenticated user's ID is taken from the JWT token and passed to the
 * service layer to create the ReservationDetail ownership record.
 *
 * Expected body: { serviceId, quantity }
 *
 * @param {Object}   req  - Express request.
 * @param {Object}   res  - Express response.
 * @param {Function} next - Next middleware (error handler).
 * @returns {Promise<void>} 201 JSON with the new reservation and detail IDs.
 */
export const createOneReservation = async (req, res, next) => {

  // Extract the required fields from the request body
  const { serviceId, quantity } = req.body;

  // Extract the authenticated user's ID from the JWT token
  const userId = req.user.id;

  try {
    // Instantiate the service manager
    const reservationManager = new ReservationServices();

    // Delegate creation to the service layer — userId is required to build
    // the ReservationDetail record that links the user to the reservation
    const result = await reservationManager.createOne({ serviceId, quantity }, userId);

    return res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: result,
      authentication: res.locals.newUserToken,
    });

  } catch (error) {
    // Forward the Boom error (404) or any unexpected error
    next(error);
  }
};