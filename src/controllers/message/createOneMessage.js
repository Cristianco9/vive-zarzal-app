// Import the MessageServices class from the messageService module
import { MessageServices } from '../../services/messageService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new message.
 *
 * This function handles the request to create a new message by extracting
 * the necessary data from the request body, invoking the appropriate service
 * method, and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the message data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOneMessage = async (req, res, next) => {

  // Extract the new message data from the request body
  const newMessage = {
    senderUserId: req.body.newMessageData.senderUserId,
    receiverUserId: req.body.newMessageData.receiverUserId,
    statusId: req.body.newMessageData.statusId,
    content: req.body.newMessageData.content,
    sentAt: req.body.newMessageData.sentAt,
  };

  // Instantiate the MessageServices class to manage the message operations
  const messageManager = new MessageServices();

  try {
    // Attempt to create a new message using the provided data
    const response = await messageManager.createOne(newMessage);

    // If the message is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Message created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during message creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the message in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};
