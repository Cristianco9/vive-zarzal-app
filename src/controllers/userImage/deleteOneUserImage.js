// Import the UserImageServices class from the userImageServices module
import { UserImageServices } from '../../services/userImageServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a user image.
 *
 * This function handles the request to delete an existing user image by extracting
 * the user image ID from the request body, invoking the appropriate service method,
 * and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the user image ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneUserImage = async (req, res, next) => {

  // Extract the user image ID from the request body
  const { id } = req.body;

  // Instantiate the UserImageServices class to manage the user image operations
  const userImageManager = new UserImageServices();

  try {
    // Attempt to delete the user image by the provided ID
    const response = await userImageManager.deleteOne(id);

    // If the user image is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'User image deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the user image from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};