// Import the UserServices class from the userServices module
import { UserServices } from '../../services/userServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to authenticate a user (login).
 *
 * Extracts the username and password from the request body and delegates the
 * credential verification to the service layer. For security reasons a single
 * generic error is returned for invalid credentials, without revealing whether
 * the username or the password was the failing factor.
 *
 * @param {Object} req - The request object containing username and password.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the login result.
 */
export const loginUser = async (req, res, next) => {

  // Extract the credentials from the request body
  const { username, password } = req.body.loginCredentials;

  // Instantiate the UserServices class to manage the user operations
  const userManager = new UserServices();

  try {
    // Attempt to authenticate the user with the provided credentials
    const response = await userManager.login(username, password);

    // For security, return a single generic error for any invalid credential
    if (response.status === 'user not found' || response.status === 'wrong password') {
      return next(Boom.unauthorized('Invalid credentials'));
    }

    // If authentication succeeds, return the JWT token
    if (response.status === 'logged') {
      return res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        // Return the generated authentication token
        authentication: response.token
      });
    }

  } catch (error) {
    // Handle errors during login by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to authenticate the user',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};