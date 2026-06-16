// Import the FavoriteUserServiceServices class from the favoriteUserService module
import { FavoriteUserServiceServices } from '../../services/favoriteUserService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single favorite by ID.
 *
 * This function handles the request to find a specific favorite in the database
 * based on the provided ID, including its related user and service. It calls the
 * appropriate service method and returns the favorite data if found.
 *
 * @param {Object} req - The request object, expected to contain the favorite ID in the body.
 * @param {Object} res - The response object to send the favorite data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the favorite data or an error.
 */
export const listOneFavoriteUserService = async (req, res, next) => {

  // Destructure the favorite ID from the request body
  const { id } = req.body;

  // Instantiate the FavoriteUserServiceServices class to manage favorite operations
  const favoriteManager = new FavoriteUserServiceServices();

  try {
    // Attempt to find the favorite record by ID
    const record = await favoriteManager.listOne(id);

    // If the favorite record is found, send a success response with the data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'Favorite found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        favorite: record
      });
    }

  } catch (error) {
    // Handle errors during the retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the favorite from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};