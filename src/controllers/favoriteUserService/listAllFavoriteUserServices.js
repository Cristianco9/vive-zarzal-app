// Import the FavoriteUserServiceServices class from the favoriteUserService module
import { FavoriteUserServiceServices } from '../../services/favoriteUserService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all favorites.
 *
 * This function handles the request to retrieve all favorites from the database,
 * each including its related user and service, invoking the appropriate service
 * method and returning a response with the list of records.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of favorites.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of favorites.
 */
export const listAllFavoriteUserServices = async (req, res, next) => {

  // Instantiate the FavoriteUserServiceServices class to manage the favorite operations
  const favoriteManager = new FavoriteUserServiceServices();

  try {
    // Attempt to retrieve all favorite records from the database
    const allRecords = await favoriteManager.listAll();

    // If records are found, send a success response with the data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Favorites retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        favorites: allRecords
      });
    }

  } catch (error) {
    // Handle errors during favorite retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve favorites from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};