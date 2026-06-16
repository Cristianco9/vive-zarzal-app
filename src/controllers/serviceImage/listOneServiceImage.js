// Import the ServiceImageServices class from the serviceImageServices module
import { ServiceImageServices } from '../../services/serviceImageServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single service image by ID.
 *
 * This function handles the request to find a specific service image in the database
 * based on the provided ID. It calls the appropriate service method and returns
 * the service image data if found. If an error occurs or the record is not found, it is handled
 * appropriately using Boom.
 *
 * @param {Object} req - The request object, expected to contain the service image ID in the body.
 * @param {Object} res - The response object to send the service image data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the service image data or an error.
 */
export const listOneServiceImage = async (req, res, next) => {

  // Destructure the service image ID from the request body
  const { id } = req.body;

  // Instantiate the ServiceImageServices class to manage service image operations
  const serviceImageManager = new ServiceImageServices();

  try {
    // Attempt to find the service image record by ID
    const record = await serviceImageManager.listOne(id);

    // If the service image record is found, send a success response with the data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'Service image found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        serviceImage: record
      });
    }

  } catch (error) {
    // Handle errors during the retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the service image from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};