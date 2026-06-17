// Import the BusinessServices class from the businessServices module
import { BusinessServices } from '../../services/businessService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all businesses.
 *
 * This function handles the request to retrieve all businesses from the database,
 * invoking the appropriate service method and returning a response with the list of businesses.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of businesses.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of businesses.
 */
export const listAllBusinesses = async (req, res, next) => {

  // Instantiate the BusinessServices class to manage the business operations
  const businessManager = new BusinessServices();

  try {
    // Attempt to retrieve all business records from the database
    const allRecords = await businessManager.listAll();

    // If records are found, send a success response with the business data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Businesses retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        businesses: allRecords
      });
    }

  } catch (error) {
    // Handle errors during business retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve businesses from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};