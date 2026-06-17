// Import the FavoriteUserServiceServices class from the favoriteUserService module
import { FavoriteUserServiceServices } from '../../services/favoriteUserService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all favorites belonging to a specific user.
 *
 * This function handles the request to retrieve every favorite owned by a
 * given user, each including its related service. The requested userId is
 * extracted from the request body, but it is only honored as-is when the
 * authenticated user is an 'administrador'; otherwise the requesting user
 * may only ever list their OWN favorites, regardless of what userId was
 * sent in the body.
 *
 * @param {Object} req - The request object, expected to contain the user ID in the body.
 * @param {Object} req.user - The authenticated user injected by authAppVerifyToken.
 * @param {number} req.user.id - The ID of the authenticated user.
 * @param {string} req.user.role - The role of the authenticated user.
 * @param {Object} res - The response object to send the list of the user's favorites.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the user's favorites or an error.
 */
export const listAllFavoriteUserServicesByUser = async (req, res, next) => {

  // Extract the requested user ID from the request body
  const { userId } = req.body;

  // Identity of the authenticated user, attached by authAppVerifyToken
  const requestingUser = req.user;

  try {
    // A non-administrator can only ever list their own favorites. If the
    // requested userId does not match the authenticated user's id, deny
    // the request instead of trusting whatever was sent in the body.
    if (
      requestingUser.role !== 'administrador' &&
      Number(userId) !== Number(requestingUser.id)
    ) {
      throw Boom.forbidden('No tienes permiso para ver los favoritos de otro usuario');
    }

    // Instantiate the FavoriteUserServiceServices class to manage favorite operations
    const favoriteManager = new FavoriteUserServiceServices();

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
    // Preserve Boom errors (e.g. the 403 above, or 400/404 from the service
    // layer) instead of masking them behind a generic 503
    if (Boom.isBoom(error)) {
      return next(error);
    }

    // Handle unexpected errors during retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the user favorites from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};