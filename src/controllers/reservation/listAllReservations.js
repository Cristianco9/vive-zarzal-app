// Import the ReservationServices class from the reservationServices module
import { ReservationServices } from '../../services/reservationService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve all reservations.
 *
 * This function handles the request to retrieve all reservations in the system
 * and is typically restricted to administrative users.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with all reservations.
 */
export const listAllReservations = async (req, res, next) => {

  try {
    // Instantiate the ReservationServices class to manage reservation operations
    const reservationManager = new ReservationServices();
    
    // Attempt to retrieve all reservations in the system
    const reservations = await reservationManager.listAll();

    // If the reservations are retrieved successfully, send them in the response
    return res.status(200).json({
      success: true,
      message: 'All reservations retrieved successfully',
      data: reservations,
      // Include the new token in the response if available
      authentication: res.locals.newUserToken
    });

  } catch (error) {
    // Handle errors during reservations retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve all reservations from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};