// Import the ReservationServices class from the reservationServices module
import { ReservationServices } from '../../services/reservationServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all reservations.
 *
 * This function handles the request to retrieve all reservations from the database,
 * invoking the appropriate service method and returning a response with the list of records.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of reservations.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of reservations.
 */
export const listAllReservations = async (req, res, next) => {

  // Instantiate the ReservationServices class to manage the reservation operations
  const reservationManager = new ReservationServices();

  try {
    // Attempt to retrieve all reservation records from the database
    const allRecords = await reservationManager.listAll();

    // If records are found, send a success response with the data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Reservations retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        reservations: allRecords
      });
    }

  } catch (error) {
    // Handle errors during reservation retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve reservations from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};