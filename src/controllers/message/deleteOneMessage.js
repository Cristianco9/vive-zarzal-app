// Import the MessageServices class from the messageService module
import { MessageServices } from '../../services/messageService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a message.
 *
 * This function handles the request to delete an existing message by
 * extracting the message ID from the request body. The acting user's
 * identity is taken from the verified JWT token (never the body), and the
 * service layer enforces that only the message's sender or receiver may
 * delete it.
 *
 * @param {Object} req - The request object containing the message ID.
 * @param {Object} req.user - The authenticated user injected by authAppVerifyToken.
 * @param {number} req.user.id - The ID of the authenticated user (must be sender or receiver).
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneMessage = async (req, res, next) => {

  // Extract the message ID from the request body
  const { id } = req.body;

  // Extract the authenticated user's ID from the JWT token — never trust the body for this
  const requestingUserId = req.user.id;

  // Instantiate the MessageServices class to manage the message operations
  const messageManager = new MessageServices();

  try {
    // Attempt to delete the message — the service layer enforces that only
    // the sender or the receiver of the message can delete it
    const response = await messageManager.deleteOne(id, requestingUserId);

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
    // Preserve Boom errors (e.g. 404 when the message isn't theirs) instead
    // of masking them behind a generic 503
    if (Boom.isBoom(error)) {
      return next(error);
    }

    // Handle unexpected errors during message deletion
    const boomError = Boom.serverUnavailable(
      'Unable to delete the message from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};