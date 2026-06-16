// Import the ServiceImageServices class from the serviceImageServices module
import { ServiceImageServices } from '../../services/serviceImageServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new service image.
 *
 * This function handles the request to create a new service image by extracting
 * the necessary data from the request body, invoking the appropriate service
 * method, and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the service image's data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOneServiceImage = async (req, res, next) => {

  // Extract the new service image data from the request body
  const newServiceImage = {
    imageUrl: req.body.newServiceImageData.imageUrl,
    description: req.body.newServiceImageData.description,
    serviceId: req.body.newServiceImageData.serviceId,
  };

  // Instantiate the ServiceImageServices class to manage the service image operations
  const serviceImageManager = new ServiceImageServices();

  try {
    // Attempt to create a new service image using the provided data
    const response = await serviceImageManager.createOne(newServiceImage);

    // If the service image is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Service image created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during service image creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the service image in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};