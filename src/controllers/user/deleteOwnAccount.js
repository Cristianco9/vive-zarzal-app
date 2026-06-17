// Import the UserServices class from the userServices module
import { UserServices } from '../../services/userService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function that allows a user to delete their own account.
 *
 * This function handles the request for a user to delete their own account by extracting
 * the user ID from the JWT token, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the authenticated user data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOwnAccount = async (req, res, next) => {

  // Extract the user ID from the JWT token (authenticated user)
  const userId = req.user.id;

  // Optionally validate that the user ID in the token matches the one in params
  const { id } = req.params;
  if (userId !== parseInt(id)) {
    return next(Boom.forbidden('Cannot delete another user\'s account'));
  }

  // Instantiate the UserServices class to manage the user operations
  const userManager = new UserServices();

  try {
    // Attempt to delete the authenticated user's own account
    const response = await userManager.deleteOwnAccount(userId);

    // If the user's account is deleted successfully, send a success response
    if (response.status === 'ACCOUNT DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Your account has been deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during user deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete your account from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};