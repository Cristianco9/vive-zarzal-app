// Import the UserImageServices class from the userImageServices module
import { UserImageServices } from '../../services/userImageServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all images belonging to a specific user.
 *
 * This function handles the request to retrieve every user image associated with
 * a given user ID, invoking the appropriate service method and returning a response
 * with the list of records. If an error occurs, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object, expected to contain the user ID in the params.
 * @param {Object} res - The response object to send the list of user images.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of user images.
 */
export const listAllUserImagesByUser = async (req, res, next) => {

  // Destructure the user ID from the request params
  const { userId } = req.params;

  // Instantiate the UserImageServices class to manage the user image operations
  const userImageManager = new UserImageServices();

  try {
    // Attempt to retrieve all image records for the provided user ID
    const allRecords = await userImageManager.listAllByUser(userId);

    // If records are found, send a success response with the data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'User images retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        userImages: allRecords
      });
    }

  } catch (error) {
    // Handle errors during retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve user images from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};