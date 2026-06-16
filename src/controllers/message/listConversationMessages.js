// Import the MessageServices class from the messageService module
import { MessageServices } from '../../services/messageService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all messages in a conversation between two users.
 *
 * This function handles the request to retrieve the conversation between two users,
 * invoking the appropriate service method and returning a response with the list of records.
 *
 * @param {Object} req - The request object, expected to contain both user IDs in the body.
 * @param {Object} res - The response object to send the conversation messages.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of conversation messages.
 */
export const listConversationMessages = async (req, res, next) => {

  // Extract conversation users IDs from the request body
  const { userAId, userBId } = req.body;

  // Instantiate the MessageServices class to manage message operations
  const messageManager = new MessageServices();

  try {
    // Attempt to retrieve the conversation messages from the database
    const records = await messageManager.listConversation(userAId, userBId);

    // If records are found, send a success response with the data
    if (records) {
      return res.status(201).json({
        success: true,
        message: 'Conversation messages retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        messages: records
      });
    }

  } catch (error) {
    // Handle errors during conversation retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve conversation messages from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};
