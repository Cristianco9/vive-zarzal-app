// Import the MessageServices class from the messageService module
import { MessageServices } from '../../services/messageService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all messages in a conversation between two users.
 *
 * This route is only reachable by 'cliente' and 'anunciante' roles (see
 * messageRouter.js); 'administrador' uses listAllMessages instead. A user
 * may only request a conversation they actually take part in — the
 * authenticated user's id (from the JWT) must match either userAId or
 * userBId, regardless of which one was sent in the body.
 *
 * @param {Object} req - The request object, expected to contain both user IDs in the body.
 * @param {Object} req.user - The authenticated user injected by authAppVerifyToken.
 * @param {number} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The response object to send the conversation messages.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of conversation messages.
 */
export const listConversationMessages = async (req, res, next) => {

  // Extract conversation users IDs from the request body
  const { userAId, userBId } = req.body;

  // Identity of the authenticated user, attached by authAppVerifyToken
  const requestingUserId = Number(req.user.id);

  try {
    // The authenticated user must be one of the two participants; otherwise
    // they are trying to read a conversation that isn't theirs
    if (requestingUserId !== Number(userAId) && requestingUserId !== Number(userBId)) {
      throw Boom.forbidden('No tienes permiso para ver una conversación de la que no haces parte');
    }

    // Instantiate the MessageServices class to manage message operations
    const messageManager = new MessageServices();

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
    // Preserve Boom errors (e.g. the 403 above, or 400 from the service
    // layer) instead of masking them behind a generic 503
    if (Boom.isBoom(error)) {
      return next(error);
    }

    // Handle unexpected errors during conversation retrieval
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve conversation messages from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};