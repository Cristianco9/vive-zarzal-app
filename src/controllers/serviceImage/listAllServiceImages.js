// Import the ServiceImageServices class from the serviceImageServices module
import { ServiceImageServices } from '../../services/serviceImageService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';
/**
 * Controller function to list all service images.
 *
 * This function handles the request to retrieve all service images from the database,
 * invoking the appropriate service method and returning a response with the list of records.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of service images.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of service images.
 */
export const listAllServiceImages = async (req, res, next) => {

  // Instantiate the ServiceImageServices class to manage the service image operations
  const serviceImageManager = new ServiceImageServices();

  try {
    // Attempt to retrieve all service image records from the database
    const allRecords = await serviceImageManager.listAll();

    // Send a success response with the retrieved service images data
    return res.status(200).json({
      success: true,
      message: 'Service images retrieved successfully',
      // Include the new token in the response
      authentication: res.locals.newUserToken,
      serviceImages: allRecords,
      count: allRecords.length
    });

  } catch (error) {
    // Handle errors during service image retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve service images from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};