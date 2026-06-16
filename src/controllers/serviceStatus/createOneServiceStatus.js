// Import the ServiceStatusServices class from the serviceStatusServices module
import { ServiceStatusServices } from '../../services/serviceStatusServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new service status.
 *
 * This function handles the request to create a new service status by extracting
 * the necessary data from the request body, invoking the appropriate service
 * method, and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the service status's data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOneServiceStatus = async (req, res, next) => {

  // Extract the new service status data from the request body
  const newServiceStatus = {
    name: req.body.newServiceStatusData.name,
    description: req.body.newServiceStatusData.description,
  };

  // Instantiate the ServiceStatusServices class to manage the service status operations
  const serviceStatusManager = new ServiceStatusServices();

  try {
    // Attempt to create a new service status using the provided data
    const response = await serviceStatusManager.createOne(newServiceStatus);

    // If the service status is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Service status created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during service status creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the service status in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};