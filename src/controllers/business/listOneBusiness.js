// Import the BusinessServices class from the businessServices module
import { BusinessServices } from '../../services/businessService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single business by ID.
 *
 * This function handles the request to find a specific business in the database
 * based on the provided ID. It calls the appropriate service method and returns
 * the business data if found. If an error occurs or the business is not found, it is handled
 * appropriately using Boom.
 *
 * @param {Object} req - The request object, expected to contain the business ID in the body.
 * @param {Object} res - The response object to send the business data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the business data or an error.
 */
export const listOneBusiness = async (req, res, next) => {

  // Destructure the business ID from the request body
  const { id } = req.body;

  // Instantiate the BusinessServices class to manage business operations
  const businessManager = new BusinessServices();

  try {
    // Attempt to find the business record by ID
    const record = await businessManager.listOne(id);

    // If the business record is found, send a success response with the business data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'Business found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        business: record
      });
    }

  } catch (error) {
    // Handle errors during the business retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the business from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};