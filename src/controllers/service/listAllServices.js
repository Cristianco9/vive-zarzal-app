// Import the ServiceServices class from the serviceServices module
import { ServiceServices } from '../../services/serviceServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all services.
 *
 * This function handles the request to retrieve all services from the database,
 * invoking the appropriate service method and returning a response with the list of records.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of services.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of services.
 */
export const listAllServices = async (req, res, next) => {

  // Instantiate the ServiceServices class to manage the service operations
  const serviceManager = new ServiceServices();

  try {
    // Attempt to retrieve all service records from the database
    const allRecords = await serviceManager.listAll();

    // If records are found, send a success response with the data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Services retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        services: allRecords
      });
    }

  } catch (error) {
    // Handle errors during service retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve services from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};