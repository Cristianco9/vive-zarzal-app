// Import the UserImageServices class from the userImageServices module
import { UserImageServices } from '../../services/userImageService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all user images.
 *
 * This function handles the request to retrieve all user images from the database,
 * invoking the appropriate service method and returning a response with the list of records.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of user images.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of user images.
 */
export const listAllUserImages = async (req, res, next) => {

  // Instantiate the UserImageServices class to manage the user image operations
  const userImageManager = new UserImageServices();

  try {
    // Attempt to retrieve all user image records from the database
    const allRecords = await userImageManager.listAll();

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