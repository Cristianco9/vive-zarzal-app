// Import the ReservationServices class from the reservationServices module
import { ReservationServices } from '../../services/reservationServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve all reservations for the authenticated user.
 *
 * This function handles the request to retrieve all reservations belonging to
 * the authenticated user by extracting the user ID from the authenticated request
 * and invoking the appropriate service method.
 *
 * @param {Object} req - The request object containing the authenticated user data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the user's reservations.
 */
export const listUserReservations = async (req, res, next) => {

  // Extract the user ID from the authenticated request
  const userId = req.user.id;

  try {
    // Instantiate the ReservationServices class to manage reservation operations
    const reservationManager = new ReservationServices();
    
    // Attempt to retrieve all reservations for the authenticated user
    const reservations = await reservationManager.listUserReservations(userId);

    // If the reservations are retrieved successfully, send them in the response
    return res.status(200).json({
      success: true,
      message: 'User reservations retrieved successfully',
      data: reservations,
      // Include the new token in the response if available
      authentication: res.locals.newUserToken
    });

  } catch (error) {
    // Handle errors during reservations retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve user reservations from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};