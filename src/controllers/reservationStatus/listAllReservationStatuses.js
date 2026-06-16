// Import the ReservationStatusServices class from the reservationStatusServices module
import { ReservationStatusServices } from '../../services/reservationStatusServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all reservation statuses.
 *
 * This function handles the request to retrieve all reservation statuses from the database,
 * invoking the appropriate service method and returning a response with the list of records.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of reservation statuses.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of reservation statuses.
 */
export const listAllReservationStatuses = async (req, res, next) => {

  // Instantiate the ReservationStatusServices class to manage the reservation status operations
  const reservationStatusManager = new ReservationStatusServices();

  try {
    // Attempt to retrieve all reservation status records from the database
    const allRecords = await reservationStatusManager.listAll();

    // If records are found, send a success response with the data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Reservation statuses retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        reservationStatuses: allRecords
      });
    }

  } catch (error) {
    // Handle errors during reservation status retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve reservation statuses from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};