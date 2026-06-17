// Import the ServiceServices class from the serviceServices module
import { ServiceServices } from '../../services/serviceService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';
/**
 * Controller function to retrieve a single service by its ID.
 *
 * This function handles the request to retrieve a specific service from the database,
 * invoking the appropriate service method and returning a response with the service data.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object containing the service ID in params.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.serviceId - The ID of the service to retrieve.
 * @param {Object} res - The response object to send the service data.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the service data.
 */
export const getServiceById = async (req, res, next) => {

  // Extract the serviceId from the request parameters
  const { serviceId } = req.params;

  // Instantiate the ServiceServices class to manage the service operations
  const serviceManager = new ServiceServices();

  try {
    // Validate that the serviceId parameter is provided and is a valid number
    if (!serviceId || isNaN(parseInt(serviceId))) {
      // If serviceId is missing or invalid, return a Boom bad request error
      const boomError = Boom.badRequest('Invalid or missing service ID provided');
      return next(boomError);
    }

    // Attempt to retrieve the service record from the database
    const service = await serviceManager.listOne(parseInt(serviceId));

    // Send a success response with the service data
    return res.status(200).json({
      success: true,
      message: 'Service retrieved successfully',
      // Include the new token in the response
      authentication: res.locals.newUserToken,
      service: service
    });

  } catch (error) {
    // Handle errors during service retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve service from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};