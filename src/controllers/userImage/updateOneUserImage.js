// Import the UserImageServices class from the userImageServices module
import { UserImageServices } from '../../services/userImageServices.js';
// Import Boom to create HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to handle the update of a user image.
 *
 * This function processes requests to update a user image's details in the database.
 * It accepts the user image ID and the new data from the request body. If the update
 * is successful, it returns a success message. If there's an error, it handles it appropriately.
 *
 * @param {Object} req - The request object, expected to contain the user image ID and new data in the body.
 * @param {Object} res - The response object to send the result of the update operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with a success message, or an error if the update fails.
 */
export const updateOneUserImage = async (req, res, next) => {

  // Extract user image ID and new data from the request body
  const { id, newUserImageData } = req.body;

  // Instantiate the UserImageServices class to manage user image operations
  const userImageManager = new UserImageServices();

  try {
    // Attempt to update the user image details in the database
    const response = await userImageManager.updateOne(id, newUserImageData);

    // If the update is successful, return a 201 response with a success message
    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'User image updated successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during the update process by returning a 503 error
    const boomError = Boom.serverUnavailable(
      'Unable to update the user image in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};