// Import the MessageServices class from the messageService module
import { MessageServices } from '../../services/messageService.js';
// Import Boom to create HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to handle the update of a message.
 *
 * This function processes requests to update a message in the database. It accepts
 * the message ID and the new message data from the request body. If the update is
 * successful, it returns a success message. If there is an error, it handles the
 * error appropriately.
 *
 * @param {Object} req - The request object, expected to contain the message ID and new data in the body.
 * @param {Object} res - The response object to send the result of the update operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with a success message, or an error if the update fails.
 */
export const updateOneMessage = async (req, res, next) => {

  // Extract message ID and new message data from the request body
  const { id, updateMessageData } = req.body;

  // Instantiate the MessageServices class to manage message operations
  const messageManager = new MessageServices();

  try {
    // Attempt to update the message details in the database
    const response = await messageManager.updateOne(id, updateMessageData);

    // If the update is successful, return a 201 response with a success message
    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Message updated successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during the update process by returning a 503 error
    const boomError = Boom.serverUnavailable(
      'Unable to update the message in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};
