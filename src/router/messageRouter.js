// ────────────────────────────────────────────────────────────────────────────
// MESSAGE ROUTER
// Entity: Message | Table: mensaje
//
// Defines and exposes the HTTP endpoints used to manage the "message" entity
// (direct messages exchanged between two users).
//
// Role matrix:
//   - 'cliente' / 'anunciante' → can create, update, delete, and list a
//     single conversation (listConversationMessages) between two users.
//   - 'administrador'          → can ONLY list all messages or a single
//     message (no create/update/delete, no conversation listing).
//
// Security pipeline applied to each route (in order):
//   1. authAppVerifyToken → validates the session JWT and refreshes it.
//   2. checkRole([...]) → authorizes only the allowed roles for the action.
//   3. validatorHandler(schema, 'body') → validates the incoming payload (Joi).
//   4. controller → executes the business operation and builds the response.
//
// Mounted at: /app/v1/messages  (see src/router/index.js)
// ────────────────────────────────────────────────────────────────────────────

// Import the Router class from Express to create an isolated routing instance
import { Router } from "express";

// ── Middlewares ─────────────────────────────────────────────────────────────

// Middleware that verifies the authentication JWT and regenerates it on success
import { authAppVerifyToken } from
  '../middlewares/tokenHandlers/authAppTokenHandler.js';
// Middleware factory that restricts access based on the user's role
import { checkRole } from '../middlewares/checkRoleHandler.js';
// Middleware factory that validates a request property against a Joi schema
import { validatorHandler } from '../middlewares/validatorHandler.js';

// ── Validation schema ───────────────────────────────────────────────────────

// Joi schema collection for the message entity
import { messageSchema } from '../schemas/messageSchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single message
import { createOneMessage } from
  '../controllers/message/createOneMessage.js';
// Controller to retrieve every message
import { listAllMessages } from
  '../controllers/message/listAllMessages.js';
// Controller to retrieve every message of a conversation between two users
import { listConversationMessages } from
  '../controllers/message/listConversationMessages.js';
// Controller to retrieve a single message by its ID
import { listOneMessage } from
  '../controllers/message/listOneMessage.js';
// Controller to update a single message by its ID
import { updateOneMessage } from
  '../controllers/message/updateOneMessage.js';
// Controller to delete a single message by its ID
import { deleteOneMessage } from
  '../controllers/message/deleteOneMessage.js';

// Create a new Router instance dedicated to the message resource
export const messageRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Send a new message
// Body: { authentication, newMessageData: { senderUserId, receiverUserId,
//         statusId, content } }
// ─────────────────────────────────────────────────────────────────────────────
messageRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the client and advertiser roles
  checkRole(['cliente', 'anunciante']),
  // Step 3: validate the creation payload
  validatorHandler(messageSchema.newMessageData, 'body'),
  // Step 4: delegate to the controller
  createOneMessage
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List every message in the system
// Body: { authentication }
// ─────────────────────────────────────────────────────────────────────────────
messageRouter.get(
  '/list-all',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: delegate to the controller (no payload to validate)
  listAllMessages
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-conversation  →  List the messages exchanged between two users
// Body: { authentication, userAId, userBId }
// ─────────────────────────────────────────────────────────────────────────────
messageRouter.get(
  '/list-conversation',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the client and advertiser roles
  checkRole(['cliente', 'anunciante']),
  // Step 3: validate that both conversation user IDs were provided
  validatorHandler(messageSchema.getConversationMessages, 'body'),
  // Step 4: delegate to the controller
  listConversationMessages
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one/:id  →  Retrieve a single message by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
messageRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(messageSchema.getMessageById, 'body'),
  // Step 4: delegate to the controller
  listOneMessage
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /update/:id  →  Update an existing message by ID
// Body: { authentication, id, updateMessageData: { statusId?, content? } }
// ─────────────────────────────────────────────────────────────────────────────
messageRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the client and advertiser roles
  checkRole(['cliente', 'anunciante']),
  // Step 3: validate the update payload
  validatorHandler(messageSchema.updateMessageData, 'body'),
  // Step 4: delegate to the controller
  updateOneMessage
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete/:id  →  Delete a message by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
messageRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the client and advertiser roles
  checkRole(['cliente', 'anunciante']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(messageSchema.deleteMessage, 'body'),
  // Step 4: delegate to the controller
  deleteOneMessage
);

// Export the configured router for registration in the main router (index.js)
export default messageRouter;