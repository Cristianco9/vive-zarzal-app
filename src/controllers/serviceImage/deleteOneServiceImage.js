// Import the ServiceImageServices class from the serviceImageServices module
import { ServiceImageServices } from '../../services/serviceImageServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a service image.
 *
 * This function handles the request to delete an existing service image by extracting
 * the service image ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the service image ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneServiceImage = async (req, res, next) => {

  // Extract the service image ID from the request body
  const { id } = req.body;

  // Instantiate the ServiceImageServices class to manage the service image operations
  const serviceImageManager = new ServiceImageServices();

  try {
    // Attempt to delete the service image by the provided ID
    const response = await serviceImageManager.deleteOne(id);

    // If the service image is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Service image deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during service image deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the service image from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};