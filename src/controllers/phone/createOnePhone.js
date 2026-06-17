// Import the PhoneServices class from the phoneServices module
import { PhoneServices } from '../../services/phoneService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new phone.
 *
 * This function handles the request to create a new phone by extracting
 * the necessary data from the request body, invoking the appropriate service
 * method, and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the phone's data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOnePhone = async (req, res, next) => {

  // Extract the new phone data from the request body
  const newPhone = {
    phoneNumber: req.body.newPhoneData.phoneNumber,
  };

  // Instantiate the PhoneServices class to manage the phone operations
  const phoneManager = new PhoneServices();

  try {
    // Attempt to create a new phone using the provided data
    const response = await phoneManager.createOne(newPhone);

    // If the phone is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Phone created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during phone creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the phone in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};