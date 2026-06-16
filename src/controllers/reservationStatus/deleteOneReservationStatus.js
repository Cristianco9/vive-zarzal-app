// Import the ReservationStatusServices class from the reservationStatusServices module
import { ReservationStatusServices } from '../../services/reservationStatusServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a reservation status.
 *
 * This function handles the request to delete an existing reservation status by extracting
 * the reservation status ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the reservation status ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneReservationStatus = async (req, res, next) => {

  // Extract the reservation status ID from the request body
  const { id } = req.body;

  // Instantiate the ReservationStatusServices class to manage the reservation status operations
  const reservationStatusManager = new ReservationStatusServices();

  try {
    // Attempt to delete the reservation status by the provided ID
    const response = await reservationStatusManager.deleteOne(id);

    // If the reservation status is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Reservation status deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during reservation status deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the reservation status from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};