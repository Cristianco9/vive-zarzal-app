// Import the ServiceStatusServices class from the serviceStatusServices module
import { ServiceStatusServices } from '../../services/serviceStatusServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a service status.
 *
 * This function handles the request to delete an existing service status by extracting
 * the service status ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the service status ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneServiceStatus = async (req, res, next) => {

  // Extract the service status ID from the request body
  const { id } = req.body;

  // Instantiate the ServiceStatusServices class to manage the service status operations
  const serviceStatusManager = new ServiceStatusServices();

  try {
    // Attempt to delete the service status by the provided ID
    const response = await serviceStatusManager.deleteOne(id);

    // If the service status is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Service status deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during service status deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the service status from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};