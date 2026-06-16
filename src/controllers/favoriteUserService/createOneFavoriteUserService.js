// Import the FavoriteUserServiceServices class from the favoriteUserService module
import { FavoriteUserServiceServices } from '../../services/favoriteUserService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new favorite (user-service link).
 *
 * This function handles the request to mark a service as favorite for a user
 * by extracting the user and service identifiers from the request body, invoking
 * the appropriate service method, and returning a response based on the outcome.
 *
 * @param {Object} req - The request object containing the favorite's data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOneFavoriteUserService = async (req, res, next) => {

  // Extract the new favorite data from the request body
  const newFavorite = {
    userId: req.body.newFavoriteData.userId,
    serviceId: req.body.newFavoriteData.serviceId,
  };

  // Instantiate the FavoriteUserServiceServices class to manage the favorite operations
  const favoriteManager = new FavoriteUserServiceServices();

  try {
    // Attempt to create a new favorite using the provided data
    const response = await favoriteManager.createOne(newFavorite);

    // If the favorite is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Favorite created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during favorite creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the favorite in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};