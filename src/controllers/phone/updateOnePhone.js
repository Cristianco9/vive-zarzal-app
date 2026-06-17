// Import the PhoneServices class from the phoneServices module
import { PhoneServices } from '../../services/phoneService.js';
// Import Boom to create HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to handle the update of a phone.
 *
 * This function processes requests to update a phone's details in the database. It accepts
 * the phone ID and the new data from the request body. If the update is successful,
 * it returns a success message. If there's an error, it handles the error appropriately.
 *
 * @param {Object} req - The request object, expected to contain the phone ID and new data in the body.
 * @param {Object} res - The response object to send the result of the update operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with a success message, or an error if the update fails.
 */
export const updateOnePhone = async (req, res, next) => {

  // Extract phone ID and new phone data from the request body
  const { id, newPhoneData } = req.body;

  // Instantiate the PhoneServices class to manage phone operations
  const phoneManager = new PhoneServices();

  try {
    // Attempt to update the phone details in the database
    const response = await phoneManager.updateOne(id, newPhoneData);

    // If the update is successful, return a 201 response with a success message
    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Phone updated successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during the update process by returning a 503 error
    const boomError = Boom.serverUnavailable(
      'Unable to update the phone in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};