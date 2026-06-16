// Import the MessageServices class from the messageService module
import { MessageServices } from '../../services/messageService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a message.
 *
 * This function handles the request to delete an existing message by extracting
 * the message ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the message ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneMessage = async (req, res, next) => {

  // Extract the message ID from the request body
  const { id } = req.body;

  // Instantiate the MessageServices class to manage the message operations
  const messageManager = new MessageServices();

  try {
    // Attempt to delete the message by the provided ID
    const response = await messageManager.deleteOne(id);

    // If the message is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Message deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during message deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the message from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};
