// Import the ServiceStatusServices class from the serviceStatusServices module
import { ServiceStatusServices } from '../../services/serviceStatusServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all service statuses.
 *
 * This function handles the request to retrieve all service statuses from the database,
 * invoking the appropriate service method and returning a response with the list of records.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of service statuses.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of service statuses.
 */
export const listAllServiceStatuses = async (req, res, next) => {

  // Instantiate the ServiceStatusServices class to manage the service status operations
  const serviceStatusManager = new ServiceStatusServices();

  try {
    // Attempt to retrieve all service status records from the database
    const allRecords = await serviceStatusManager.listAll();

    // If records are found, send a success response with the data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Service statuses retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        serviceStatuses: allRecords
      });
    }

  } catch (error) {
    // Handle errors during service status retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve service statuses from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};