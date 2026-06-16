// Import the ReservationServices class from the reservationServices module
import { ReservationServices } from '../../services/reservationServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a reservation.
 *
 * This function handles the request to delete an existing reservation by extracting
 * the reservation ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the reservation ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneReservation = async (req, res, next) => {

  // Extract the reservation ID from the request body
  const { id } = req.body;

  // Instantiate the ReservationServices class to manage the reservation operations
  const reservationManager = new ReservationServices();

  try {
    // Attempt to delete the reservation by the provided ID
    const response = await reservationManager.deleteOne(id);

    // If the reservation is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Reservation deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during reservation deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the reservation from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};