// Import the ReservationStatusServices class from the reservationStatusServices module
import { ReservationStatusServices } from '../../services/reservationStatusServices.js';
// Import Boom to create HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to handle the update of a reservation status.
 *
 * This function processes requests to update a reservation status's details in the database. It accepts
 * the reservation status ID and the new data from the request body. If the update is successful,
 * it returns a success message. If there's an error, it handles the error appropriately.
 *
 * @param {Object} req - The request object, expected to contain the reservation status ID and new data in the body.
 * @param {Object} res - The response object to send the result of the update operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with a success message, or an error if the update fails.
 */
export const updateOneReservationStatus = async (req, res, next) => {

  // Extract reservation status ID and new reservation status data from the request body
  const { id, newReservationStatusData } = req.body;

  // Instantiate the ReservationStatusServices class to manage reservation status operations
  const reservationStatusManager = new ReservationStatusServices();

  try {
    // Attempt to update the reservation status details in the database
    const response = await reservationStatusManager.updateOne(id, newReservationStatusData);

    // If the update is successful, return a 201 response with a success message
    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Reservation status updated successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during the update process by returning a 503 error
    const boomError = Boom.serverUnavailable(
      'Unable to update the reservation status in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};