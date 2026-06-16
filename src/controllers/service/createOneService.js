// Import the ServiceServices class from the serviceServices module
import { ServiceServices } from '../../services/serviceServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new service.
 *
 * This function handles the request to create a new service in the database,
 * invoking the appropriate service method and returning a response with the creation status.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object containing the service data in body.
 * @param {Object} req.body - The service data to create.
 * @param {Object} res - The response object to send the creation status.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the creation status.
 */
export const createService = async (req, res, next) => {

  // Extract the service data from the request body
  const serviceData = req.body;

  // Instantiate the ServiceServices class to manage the service operations
  const serviceManager = new ServiceServices();

  try {
    // Attempt to create a new service record in the database
    const creationResult = await serviceManager.createOne(serviceData);

    // Send a success response with the creation status
    return res.status(201).json({
      success: true,
      message: 'Service created successfully',
      // Include the new token in the response
      authentication: res.locals.newUserToken,
      result: creationResult
    });

  } catch (error) {
    // Handle errors during service creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create service in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};