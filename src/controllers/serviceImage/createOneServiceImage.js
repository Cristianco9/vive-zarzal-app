// Import the ServiceImageServices class from the serviceImageServices module
import { ServiceImageServices } from '../../services/serviceImageServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new service image.
 *
 * This function handles the request to create a new service image in the database,
 * invoking the appropriate service method and returning a response with the creation status.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object containing the service image data in body.
 * @param {Object} req.body - The service image data to create.
 * @param {Object} res - The response object to send the creation status.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the creation status.
 */
export const createServiceImage = async (req, res, next) => {

  // Extract the service image data from the request body
  const serviceImageData = req.body;

  // Instantiate the ServiceImageServices class to manage the service image operations
  const serviceImageManager = new ServiceImageServices();

  try {
    // Attempt to create a new service image record in the database
    const creationResult = await serviceImageManager.createOne(serviceImageData);

    // Send a success response with the creation status
    return res.status(201).json({
      success: true,
      message: 'Service image created successfully',
      // Include the new token in the response
      authentication: res.locals.newUserToken,
      result: creationResult
    });

  } catch (error) {
    // Handle errors during service image creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create service image in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};