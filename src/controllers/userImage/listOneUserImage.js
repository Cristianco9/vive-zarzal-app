// Import the UserImageServices class from the userImageServices module
import { UserImageServices } from '../../services/userImageServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single user image by ID.
 *
 * This function handles the request to find a specific user image in the database
 * based on the provided ID. It calls the appropriate service method and returns
 * the record if found. If an error occurs, it is handled appropriately using Boom.
 *
 * @param {Object} req - The request object, expected to contain the user image ID in the body.
 * @param {Object} res - The response object to send the user image data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the user image data or an error.
 */
export const listOneUserImage = async (req, res, next) => {

  // Destructure the user image ID from the request body
  const { id } = req.body;

  // Instantiate the UserImageServices class to manage user image operations
  const userImageManager = new UserImageServices();

  try {
    // Attempt to find the user image record by ID
    const record = await userImageManager.listOne(id);

    // If the record is found, send a success response with the data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'User image found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        userImage: record
      });
    }

  } catch (error) {
    // Handle errors during retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the user image from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};