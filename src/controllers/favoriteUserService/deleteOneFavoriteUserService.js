// Import the FavoriteUserServiceServices class from the favoriteUserService module
import { FavoriteUserServiceServices } from '../../services/favoriteUserService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a favorite (user-service link).
 *
 * This function handles the request to remove an existing favorite by extracting
 * the favorite ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the favorite ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneFavoriteUserService = async (req, res, next) => {

  // Extract the favorite ID from the request body
  const { id } = req.body;

  // Instantiate the FavoriteUserServiceServices class to manage the favorite operations
  const favoriteManager = new FavoriteUserServiceServices();

  try {
    // Attempt to delete the favorite by the provided ID
    const response = await favoriteManager.deleteOne(id);

    // If the favorite is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Favorite deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during favorite deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the favorite from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};