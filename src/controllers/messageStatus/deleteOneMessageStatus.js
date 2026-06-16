// Import the MessageStatusServices class from the messageStatusServices module
import { MessageStatusServices } from '../../services/messageStatusServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a message status.
 *
 * This function handles the request to delete an existing message status by extracting
 * the message status ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the message status ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneMessageStatus = async (req, res, next) => {

  // Extract the message status ID from the request body
  const { id } = req.body;

  // Instantiate the MessageStatusServices class to manage the message status operations
  const messageStatusManager = new MessageStatusServices();

  try {
    // Attempt to delete the message status by the provided ID
    const response = await messageStatusManager.deleteOne(id);

    // If the message status is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Message status deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during message status deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the message status from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};