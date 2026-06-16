// Import the ReservationServices class from the reservationServices module
import { ReservationServices } from '../../services/reservationServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new reservation.
 *
 * This function handles the request to create a new reservation by extracting
 * the necessary data from the request body, invoking the appropriate service
 * method, and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the reservation's data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOneReservation = async (req, res, next) => {

  // Extract the new reservation data from the request body
  const newReservation = {
    serviceId: req.body.newReservationData.serviceId,
  };

  // Instantiate the ReservationServices class to manage the reservation operations
  const reservationManager = new ReservationServices();

  try {
    // Attempt to create a new reservation using the provided data
    const response = await reservationManager.createOne(newReservation);

    // If the reservation is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Reservation created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during reservation creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the reservation in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};