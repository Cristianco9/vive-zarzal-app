// Import the ServiceServices class from the serviceServices module
import { ServiceServices } from '../../services/serviceServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a service.
 *
 * This function handles the request to delete an existing service by extracting
 * the service ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the service ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneService = async (req, res, next) => {

  // Extract the service ID from the request body
  const { id } = req.body;

  // Instantiate the ServiceServices class to manage the service operations
  const serviceManager = new ServiceServices();

  try {
    // Attempt to delete the service by the provided ID
    const response = await serviceManager.deleteOne(id);

    // If the service is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Service deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during service deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the service from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};