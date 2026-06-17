// Import the ReservationStatusServices class from the reservationStatusServices module
import { ReservationStatusServices } from '../../services/reservationStatusService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new reservation status.
 *
 * This function handles the request to create a new reservation status by extracting
 * the necessary data from the request body, invoking the appropriate service
 * method, and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the reservation status's data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOneReservationStatus = async (req, res, next) => {

  // Extract the new reservation status data from the request body
  const newReservationStatus = {
    name: req.body.newReservationStatusData.name,
    description: req.body.newReservationStatusData.description,
  };

  // Instantiate the ReservationStatusServices class to manage the reservation status operations
  const reservationStatusManager = new ReservationStatusServices();

  try {
    // Attempt to create a new reservation status using the provided data
    const response = await reservationStatusManager.createOne(newReservationStatus);

    // If the reservation status is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Reservation status created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during reservation status creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the reservation status in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};