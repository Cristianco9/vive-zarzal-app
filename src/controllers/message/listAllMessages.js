// Import the MessageServices class from the messageService module
import { MessageServices } from '../../services/messageService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all messages.
 *
 * This function handles the request to retrieve all messages from the database,
 * invoking the appropriate service method and returning a response with the list of records.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of messages.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of messages.
 */
export const listAllMessages = async (req, res, next) => {

  // Instantiate the MessageServices class to manage the message operations
  const messageManager = new MessageServices();

  try {
    // Attempt to retrieve all message records from the database
    const allRecords = await messageManager.listAll();

    // If records are found, send a success response with the data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Messages retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        messages: allRecords
      });
    }

  } catch (error) {
    // Handle errors during message retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve messages from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};
