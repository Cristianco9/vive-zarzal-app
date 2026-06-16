// Import the ServiceImageServices class from the serviceImageServices module
import { ServiceImageServices } from '../../services/serviceImageServices.js';
// Import Boom to create HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to handle the update of a service image.
 *
 * This function processes requests to update a service image's details in the database. It accepts
 * the service image ID and the new data from the request body. If the update is successful,
 * it returns a success message. If there's an error, it handles the error appropriately.
 *
 * @param {Object} req - The request object, expected to contain the service image ID and new data in the body.
 * @param {Object} res - The response object to send the result of the update operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with a success message, or an error if the update fails.
 */
export const updateOneServiceImage = async (req, res, next) => {

  // Extract service image ID and new service image data from the request body
  const { id, newServiceImageData } = req.body;

  // Instantiate the ServiceImageServices class to manage service image operations
  const serviceImageManager = new ServiceImageServices();

  try {
    // Attempt to update the service image details in the database
    const response = await serviceImageManager.updateOne(id, newServiceImageData);

    // If the update is successful, return a 201 response with a success message
    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Service image updated successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during the update process by returning a 503 error
    const boomError = Boom.serverUnavailable(
      'Unable to update the service image in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};