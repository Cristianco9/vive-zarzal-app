// Import the FavoriteUserServiceServices class from the favoriteUserService module
import { FavoriteUserServiceServices } from '../../services/favoriteUserService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all favorites belonging to a specific user.
 *
 * This function handles the request to retrieve every favorite owned by a given
 * user, each including its related service. It extracts the user ID from the request
 * body, invokes the appropriate service method, and returns the list of records.
 *
 * @param {Object} req - The request object, expected to contain the user ID in the body.
 * @param {Object} res - The response object to send the list of the user's favorites.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the user's favorites or an error.
 */
export const listAllFavoriteUserServicesByUser = async (req, res, next) => {

  // Extract the user ID from the request body
  const { userId } = req.body;

  // Instantiate the FavoriteUserServiceServices class to manage favorite operations
  const favoriteManager = new FavoriteUserServiceServices();

  try {
    // Attempt to retrieve all favorites belonging to the provided user
    const userRecords = await favoriteManager.listAllByUser(userId);

    // If records are found, send a success response with the data
    if (userRecords) {
      return res.status(201).json({
        success: true,
        message: 'User favorites retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        favorites: userRecords
      });
    }

  } catch (error) {
    // Handle errors during retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the user favorites from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};