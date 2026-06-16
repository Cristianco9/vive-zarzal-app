// Import the MessageStatusServices class from the messageStatusServices module
import { MessageStatusServices } from '../../services/messageStatusServices.js';
// Import Boom to create HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to handle the update of a message status.
 *
 * This function processes requests to update a message status's details in the database. It accepts
 * the message status ID and the new data from the request body. If the update is successful,
 * it returns a success message. If there's an error, it handles the error appropriately.
 *
 * @param {Object} req - The request object, expected to contain the message status ID and new data in the body.
 * @param {Object} res - The response object to send the result of the update operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with a success message, or an error if the update fails.
 */
export const updateOneMessageStatus = async (req, res, next) => {

  // Extract message status ID and new message status data from the request body
  const { id, newMessageStatusData } = req.body;

  // Instantiate the MessageStatusServices class to manage message status operations
  const messageStatusManager = new MessageStatusServices();

  try {
    // Attempt to update the message status details in the database
    const response = await messageStatusManager.updateOne(id, newMessageStatusData);

    // If the update is successful, return a 201 response with a success message
    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Message status updated successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during the update process by returning a 503 error
    const boomError = Boom.serverUnavailable(
      'Unable to update the message status in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};