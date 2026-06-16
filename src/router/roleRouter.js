// ────────────────────────────────────────────────────────────────────────────
// ROLE ROUTER
// Entity: Role | Table: rol
//
// Defines and exposes the HTTP endpoints used to manage the "role" catalog.
// This is an administrative catalog: only users whose JWT carries the
// 'administrador' role are allowed to create, update, or delete records.
// Every role can read it (list-all / list-one), since roles are referenced
// across the application (e.g. to display or validate a user's role).
//
// Security pipeline applied to each route (in order):
//   1. authAppVerifyToken → validates the session JWT and refreshes it.
//   2. checkRole([...]) → authorizes only the allowed roles for the action.
//   3. validatorHandler(schema, 'body') → validates the incoming payload (Joi).
//   4. controller → executes the business operation and builds the response.
//
// Mounted at: /app/v1/roles  (see src/router/index.js)
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

// Joi schema collection for the role entity
import { roleSchema } from '../schemas/roleSchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single role
import { createOneRole } from
  '../controllers/role/createOneRole.js';
// Controller to retrieve every role
import { listAllRoles } from
  '../controllers/role/listAllRoles.js';
// Controller to retrieve a single role by its ID
import { listOneRole } from
  '../controllers/role/listOneRole.js';
// Controller to update a single role by its ID
import { updateOneRole } from
  '../controllers/role/updateOneRole.js';
// Controller to delete a single role by its ID
import { deleteOneRole } from
  '../controllers/role/deleteOneRole.js';

// Create a new Router instance dedicated to the role resource
export const roleRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Create a new role
// Body: { authentication, newRoleData: { name, description? } }
// ─────────────────────────────────────────────────────────────────────────────
roleRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the creation payload
  validatorHandler(roleSchema.newRoleData, 'body'),
  // Step 4: delegate to the controller
  createOneRole
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List all roles
// Body: { authentication }
// ─────────────────────────────────────────────────────────────────────────────
roleRouter.get(
  '/list-all',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: delegate to the controller (no payload to validate)
  listAllRoles
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one/:id  →  Retrieve a single role by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
roleRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(roleSchema.getRoleById, 'body'),
  // Step 4: delegate to the controller
  listOneRole
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /update/:id  →  Update an existing role by ID
// Body: { authentication, id, newRoleData: { name?, description? } }
// ─────────────────────────────────────────────────────────────────────────────
roleRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the update payload
  validatorHandler(roleSchema.updateRoleData, 'body'),
  // Step 4: delegate to the controller
  updateOneRole
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete/:id  →  Delete a role by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
roleRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(roleSchema.deleteRole, 'body'),
  // Step 4: delegate to the controller
  deleteOneRole
);

// Export the configured router for registration in the main router (index.js)
export default roleRouter;