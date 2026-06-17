// Import the ReservationStatusServices class from the reservationStatusServices module
import { ReservationStatusServices } from '../../services/reservationStatusService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single reservation status by ID.
 *
 * This function handles the request to find a specific reservation status in the database
 * based on the provided ID. It calls the appropriate service method and returns
 * the reservation status data if found. If an error occurs or the record is not found, it is handled
 * appropriately using Boom.
 *
 * @param {Object} req - The request object, expected to contain the reservation status ID in the body.
 * @param {Object} res - The response object to send the reservation status data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the reservation status data or an error.
 */
export const listOneReservationStatus = async (req, res, next) => {

  // Destructure the reservation status ID from the request body
  const { id } = req.body;

  // Instantiate the ReservationStatusServices class to manage reservation status operations
  const reservationStatusManager = new ReservationStatusServices();

  try {
    // Attempt to find the reservation status record by ID
    const record = await reservationStatusManager.listOne(id);

    // If the reservation status record is found, send a success response with the data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'Reservation status found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        reservationStatus: record
      });
    }

  } catch (error) {
    // Handle errors during the retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the reservation status from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};