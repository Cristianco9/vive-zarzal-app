// Import the MessageServices class from the messageService module
import { MessageServices } from '../../services/messageService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single message by ID.
 *
 * This function handles the request to find a specific message in the database
 * based on the provided ID. It calls the appropriate service method and returns
 * the message data if found.
 *
 * @param {Object} req - The request object, expected to contain the message ID in the body.
 * @param {Object} res - The response object to send the message data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the message data or an error.
 */
export const listOneMessage = async (req, res, next) => {

  // Destructure the message ID from the request body
  const { id } = req.body;

  // Instantiate the MessageServices class to manage message operations
  const messageManager = new MessageServices();

  try {
    // Attempt to find the message record by ID
    const record = await messageManager.listOne(id);

    // If the message record is found, send a success response with the data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'Message found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        messageData: record
      });
    }

  } catch (error) {
    // Handle errors during the retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the message from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};
