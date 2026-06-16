// Import the PhoneServices class from the phoneServices module
import { PhoneServices } from '../../services/phoneServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single phone by ID.
 *
 * This function handles the request to find a specific phone in the database
 * based on the provided ID. It calls the appropriate service method and returns
 * the phone data if found. If an error occurs or the record is not found, it is handled
 * appropriately using Boom.
 *
 * @param {Object} req - The request object, expected to contain the phone ID in the body.
 * @param {Object} res - The response object to send the phone data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the phone data or an error.
 */
export const listOnePhone = async (req, res, next) => {

  // Destructure the phone ID from the request body
  const { id } = req.body;

  // Instantiate the PhoneServices class to manage phone operations
  const phoneManager = new PhoneServices();

  try {
    // Attempt to find the phone record by ID
    const record = await phoneManager.listOne(id);

    // If the phone record is found, send a success response with the data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'Phone found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        phone: record
      });
    }

  } catch (error) {
    // Handle errors during the retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the phone from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};