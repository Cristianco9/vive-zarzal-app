// ────────────────────────────────────────────────────────────────────────────
// MESSAGE STATUS ROUTER
// Entity: MessageStatus | Table: estado_mensaje
//
// Defines and exposes the HTTP endpoints used to manage the "message status"
// catalog. This is an administrative catalog: every route is protected and only
// users whose JWT carries the 'administrador' role are allowed to operate on it.
//
// Security pipeline applied to each route (in order):
//   1. authAppVerifyToken → validates the session JWT and refreshes it.
//   2. checkRole(['administrador', 'cliente', 'anunciante']) → authorizes
//      only the administrator role to create, update, and delete.
//   3. validatorHandler(schema, 'body') → validates the incoming payload (Joi).
//   4. controller → executes the business operation and builds the response.
//
// Mounted at: /app/v1/message-statuses  (see src/router/index.js)
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

// Joi schema collection for the message status entity
import { messageStatusSchema } from '../schemas/messageStatusSchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single message status
import { createOneMessageStatus } from
  '../controllers/messageStatus/createOneMessageStatus.js';
// Controller to retrieve every message status
import { listAllMessageStatuses } from
  '../controllers/messageStatus/listAllMessageStatuses.js';
// Controller to retrieve a single message status by its ID
import { listOneMessageStatus } from
  '../controllers/messageStatus/listOneMessageStatus.js';
// Controller to update a single message status by its ID
import { updateOneMessageStatus } from
  '../controllers/messageStatus/updateOneMessageStatus.js';
// Controller to delete a single message status by its ID
import { deleteOneMessageStatus } from
  '../controllers/messageStatus/deleteOneMessageStatus.js';

// Create a new Router instance dedicated to the message status resource
export const messageStatusRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Create a new message status
// Body: { authentication, newMessageStatusData: { name, description? } }
// ─────────────────────────────────────────────────────────────────────────────
messageStatusRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the creation payload
  validatorHandler(messageStatusSchema.newMessageStatusData, 'body'),
  // Step 4: delegate to the controller
  createOneMessageStatus
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List all message statuses
// Body: { authentication }
// ─────────────────────────────────────────────────────────────────────────────
messageStatusRouter.get(
  '/list-all',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: delegate to the controller (no payload to validate)
  listAllMessageStatuses
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one/:id  →  Retrieve a single message status by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
messageStatusRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(messageStatusSchema.getMessageStatusById, 'body'),
  // Step 4: delegate to the controller
  listOneMessageStatus
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /update/:id  →  Update an existing message status by ID
// Body: { authentication, id, newMessageStatusData: { name?, description? } }
// ─────────────────────────────────────────────────────────────────────────────
messageStatusRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the update payload
  validatorHandler(messageStatusSchema.updateMessageStatusData, 'body'),
  // Step 4: delegate to the controller
  updateOneMessageStatus
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete/:id  →  Delete a message status by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
messageStatusRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(messageStatusSchema.deleteMessageStatus, 'body'),
  // Step 4: delegate to the controller
  deleteOneMessageStatus
);

// Export the configured router for registration in the main router (index.js)
export default messageStatusRouter;