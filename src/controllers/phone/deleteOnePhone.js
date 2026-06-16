// Import the PhoneServices class from the phoneServices module
import { PhoneServices } from '../../services/phoneServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a phone.
 *
 * This function handles the request to delete an existing phone by extracting
 * the phone ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the phone ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOnePhone = async (req, res, next) => {

  // Extract the phone ID from the request body
  const { id } = req.body;

  // Instantiate the PhoneServices class to manage the phone operations
  const phoneManager = new PhoneServices();

  try {
    // Attempt to delete the phone by the provided ID
    const response = await phoneManager.deleteOne(id);

    // If the phone is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Phone deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during phone deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the phone from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};