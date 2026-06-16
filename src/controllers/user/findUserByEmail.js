// Import the UserServices class from the userServices module
import { UserServices } from '../../services/userServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to find a user by email (authentication layer).
 *
 * This function handles the request to find a specific user in the database
 * based on the provided email, INCLUDING the password hash. It is intended to
 * be used only by the authentication layer for credential verification and must
 * never expose the password through the public API.
 *
 * @param {Object} req - The request object, expected to contain the user's email in the params.
 * @param {Object} res - The response object to send the user data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the user data or an error.
 */
export const findUserByEmail = async (req, res, next) => {

  // Destructure the email from the request parameters
  const { email } = req.params;

  // Instantiate the UserServices class to manage user operations
  const userManager = new UserServices();

  try {
    // Attempt to find the user record by email (password included for auth)
    const record = await userManager.findByEmailForAuth(email);

    // If the user record is found, send a success response with the data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'User found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        user: record
      });
    }

    // If no user was found, return a not found error
    return next(Boom.notFound('User not found'));

  } catch (error) {
    // Handle errors during the retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the user from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};