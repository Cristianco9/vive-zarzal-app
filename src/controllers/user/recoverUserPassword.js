// Import the UserServices class from the userServices module
import { UserServices } from '../../services/userService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to recover (reset) a user's password.
 *
 * Extracts the email and the new password from the request body, delegates the
 * password reset to the service layer and returns a success response.
 *
 * @param {Object} req - The request object containing email and newPassword.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const recoverUserPassword = async (req, res, next) => {

  // Extract the email and new password from the request body
  const { email, newPassword } = req.body.passwordRecoveryData;

  // Instantiate the UserServices class to manage the user operations
  const userManager = new UserServices();

  try {
    // Attempt to reset the user's password
    const response = await userManager.recoverPassword(email, newPassword);

    // If the password was updated successfully, send a success response
    if (response.status === 'PASSWORD UPDATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Password updated successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during the password recovery by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to recover the password',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};