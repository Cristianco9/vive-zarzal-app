// Import the UserImageServices class from the userImageServices module
import { UserImageServices } from '../../services/userImageService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new user image.
 *
 * This function handles the request to create a new user image by extracting
 * the necessary data from the request body, invoking the appropriate service
 * method, and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the user image data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOneUserImage = async (req, res, next) => {

  // Extract the new user image data from the request body
  const newUserImage = {
    userId: req.body.newUserImageData.userId,
    url: req.body.newUserImageData.url,
    name: req.body.newUserImageData.name,
    altText: req.body.newUserImageData.altText,
  };

  // Instantiate the UserImageServices class to manage the user image operations
  const userImageManager = new UserImageServices();

  try {
    // Attempt to create a new user image using the provided data
    const response = await userImageManager.createOne(newUserImage);

    // If the user image is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'User image created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the user image in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};