// Import the MessageServices class from the messageService module
import { MessageServices } from '../../services/messageService.js';
// Import Boom to create HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to handle the update of a message.
 *
 * This function processes requests to update a message in the database. It
 * accepts the message ID and the new message data from the request body.
 * The acting user's identity is taken from the verified JWT token (never
 * the body), and the service layer enforces that only the message's sender
 * or receiver may update it.
 *
 * @param {Object} req - The request object, expected to contain the message ID and new data in the body.
 * @param {Object} req.user - The authenticated user injected by authAppVerifyToken.
 * @param {number} req.user.id - The ID of the authenticated user (must be sender or receiver).
 * @param {Object} res - The response object to send the result of the update operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with a success message, or an error if the update fails.
 */
export const updateOneMessage = async (req, res, next) => {

  // Extract message ID and new message data from the request body
  const { id, updateMessageData } = req.body;

  // Extract the authenticated user's ID from the JWT token — never trust the body for this
  const requestingUserId = req.user.id;

  // Instantiate the MessageServices class to manage message operations
  const messageManager = new MessageServices();

  try {
    // Attempt to update the message — the service layer enforces that only
    // the sender or the receiver of the message can update it
    const response = await messageManager.updateOne(id, requestingUserId, updateMessageData);

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
    // Preserve Boom errors (e.g. 404 when the message isn't theirs) instead
    // of masking them behind a generic 503
    if (Boom.isBoom(error)) {
      return next(error);
    }

    // Handle unexpected errors during the update process
    const boomError = Boom.serverUnavailable(
      'Unable to update the message in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};