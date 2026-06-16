// Import the ReservationServices class from the reservationServices module
import { ReservationServices } from '../../services/reservationServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single reservation by ID.
 *
 * This function handles the request to find a specific reservation in the database
 * based on the provided ID. It calls the appropriate service method and returns
 * the reservation data if found. If an error occurs or the record is not found, it is handled
 * appropriately using Boom.
 *
 * @param {Object} req - The request object, expected to contain the reservation ID in the body.
 * @param {Object} res - The response object to send the reservation data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the reservation data or an error.
 */
export const listOneReservation = async (req, res, next) => {

  // Destructure the reservation ID from the request body
  const { id } = req.body;

  // Instantiate the ReservationServices class to manage reservation operations
  const reservationManager = new ReservationServices();

  try {
    // Attempt to find the reservation record by ID
    const record = await reservationManager.listOne(id);

    // If the reservation record is found, send a success response with the data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'Reservation found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        reservation: record
      });
    }

  } catch (error) {
    // Handle errors during the retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the reservation from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};