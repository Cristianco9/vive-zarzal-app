// Import the MessageStatusServices class from the messageStatusServices module
import { MessageStatusServices } from '../../services/messageStatusServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all message statuses.
 *
 * This function handles the request to retrieve all message statuses from the database,
 * invoking the appropriate service method and returning a response with the list of records.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of message statuses.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of message statuses.
 */
export const listAllMessageStatuses = async (req, res, next) => {

  // Instantiate the MessageStatusServices class to manage the message status operations
  const messageStatusManager = new MessageStatusServices();

  try {
    // Attempt to retrieve all message status records from the database
    const allRecords = await messageStatusManager.listAll();

    // If records are found, send a success response with the data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Message statuses retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        messageStatuses: allRecords
      });
    }

  } catch (error) {
    // Handle errors during message status retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve message statuses from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};