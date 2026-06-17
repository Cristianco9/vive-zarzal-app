// Import the PhoneServices class from the phoneServices module
import { PhoneServices } from '../../services/phoneService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all phones related to a specific user.
 *
 * This function handles the request to retrieve every phone associated with a
 * given user, considering BOTH sources defined in the application context:
 *   1. The user's personal phones   (User ↔ Phone via UserPhone).
 *   2. The phones of the business the user owns, if any
 *      (Business ↔ Phone via BusinessPhone).
 *
 * It extracts the user ID from the request body, invokes the appropriate service
 * method, and returns the grouped result. If an error occurs, it is handled
 * gracefully using Boom.
 *
 * @param {Object} req - The request object, expected to contain the user ID in the body.
 * @param {Object} res - The response object to send the user's phones.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the user's phones or an error.
 */
export const listAllPhonesByUser = async (req, res, next) => {

  // Destructure the user ID from the request body
  const { userId } = req.body;

  // Instantiate the PhoneServices class to manage the phone operations
  const phoneManager = new PhoneServices();

  try {
    // Attempt to retrieve all phones (personal + business) for the provided user
    const userRecords = await phoneManager.listAllByUser(userId);

    // If records are found, send a success response with the data
    if (userRecords) {
      return res.status(201).json({
        success: true,
        message: 'User phones retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        // Grouped result: personalPhones, businessPhones and combined allPhones
        phones: userRecords
      });
    }

  } catch (error) {
    // Handle errors during retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the user phones from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};