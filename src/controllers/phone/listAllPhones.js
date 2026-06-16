// Import the PhoneServices class from the phoneServices module
import { PhoneServices } from '../../services/phoneServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all phones.
 *
 * This function handles the request to retrieve all phones from the database,
 * invoking the appropriate service method and returning a response with the list of records.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of phones.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of phones.
 */
export const listAllPhones = async (req, res, next) => {

  // Instantiate the PhoneServices class to manage the phone operations
  const phoneManager = new PhoneServices();

  try {
    // Attempt to retrieve all phone records from the database
    const allRecords = await phoneManager.listAll();

    // If records are found, send a success response with the data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Phones retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        phones: allRecords
      });
    }

  } catch (error) {
    // Handle errors during phone retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve phones from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};