// Import the MessageStatusServices class from the messageStatusServices module
import { MessageStatusServices } from '../../services/messageStatusServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single message status by ID.
 *
 * This function handles the request to find a specific message status in the database
 * based on the provided ID. It calls the appropriate service method and returns
 * the message status data if found. If an error occurs or the record is not found, it is handled
 * appropriately using Boom.
 *
 * @param {Object} req - The request object, expected to contain the message status ID in the body.
 * @param {Object} res - The response object to send the message status data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the message status data or an error.
 */
export const listOneMessageStatus = async (req, res, next) => {

  // Destructure the message status ID from the request body
  const { id } = req.body;

  // Instantiate the MessageStatusServices class to manage message status operations
  const messageStatusManager = new MessageStatusServices();

  try {
    // Attempt to find the message status record by ID
    const record = await messageStatusManager.listOne(id);

    // If the message status record is found, send a success response with the data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'Message status found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        messageStatus: record
      });
    }

  } catch (error) {
    // Handle errors during the retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the message status from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};