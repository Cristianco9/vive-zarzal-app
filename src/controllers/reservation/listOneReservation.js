// Import the ReservationServices class from the reservationServices module
import { ReservationServices } from '../../services/reservationServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single reservation.
 *
 * This function handles the request to retrieve a single reservation by extracting
 * the reservation ID from the request parameters and invoking the appropriate service
 * method with user ownership validation.
 *
 * @param {Object} req - The request object containing the reservation ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the reservation data.
 */
export const listOneReservation = async (req, res, next) => {

  // Extract the reservation ID from the request parameters
  const { id } = req.params;
  
  // Extract the user ID from the authenticated request
  const userId = req.user.id;

  try {
    // Validate that reservation ID is provided
    if (!id) {
      // Throw a Boom bad request error if reservation ID is missing
      throw Boom.badRequest('Reservation ID is required');
    }

    // Instantiate the ReservationServices class to manage reservation operations
    const reservationManager = new ReservationServices();
    
    // Attempt to retrieve the reservation using the provided ID and user ID
    const reservation = await reservationManager.listOne(Number(id), userId);

    // If the reservation is retrieved successfully, send it in the response
    return res.status(200).json({
      success: true,
      message: 'Reservation retrieved successfully',
      data: reservation,
      // Include the new token in the response if available
      authentication: res.locals.newUserToken
    });

  } catch (error) {
    // Handle errors during reservation retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the reservation from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};