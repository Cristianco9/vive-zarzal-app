// Import the BusinessServices class from the businessServices module
import { BusinessServices } from '../../services/businessService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a business.
 *
 * This function handles the request to delete an existing business by extracting
 * the business ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the business ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneBusiness = async (req, res, next) => {

  // Extract the business ID from the request body
  const { id } = req.body;

  // Instantiate the BusinessServices class to manage the business operations
  const businessManager = new BusinessServices();

  try {
    // Attempt to delete the business by the provided ID
    const response = await businessManager.deleteOne(id);

    // If the business is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Business deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during business deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the business from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};