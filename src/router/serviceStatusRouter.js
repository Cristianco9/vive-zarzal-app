// ────────────────────────────────────────────────────────────────────────────
// SERVICE STATUS ROUTER
// Entity: ServiceStatus | Table: estado_servicio
//
// Defines and exposes the HTTP endpoints used to manage the "serviceStatus" entity.
// A service status represents the current state of a service (e.g., active, inactive, etc.).
// This is a catalog entity with restricted write access.
//
// Security pipeline applied to each route (in order):
//   1. authAppVerifyToken → validates the session JWT and refreshes it.
//   2. checkRole(['administrador', 'anunciante', 'cliente]) → authorizes 
//      only administrators to create, update and delete. All roles can list.
//   3. validatorHandler(schema, 'body') → validates the incoming payload (Joi).
//   4. controller → executes the business operation and builds the response.
//
// Role-based permissions:
//   - Administrator (Administrador): Full CRUD access
//   - Advertiser (Anunciante): Read-only access (list all, list one)
//   - Client (Cliente): Read-only access (list all, list one)
//
// Mounted at: /app/v1/service-statuses  (see src/router/index.js)
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

// Joi schema collection for the service status entity
import { serviceStatusSchema } from '../schemas/serviceStatusSchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single service status
import { createOneServiceStatus } from
  '../controllers/serviceStatus/createOneServiceStatus.js';
// Controller to retrieve every service status
import { listAllServiceStatuses } from
  '../controllers/serviceStatus/listAllServiceStatuses.js';
// Controller to retrieve a single service status by its ID
import { listOneServiceStatus } from
  '../controllers/serviceStatus/listOneServiceStatus.js';
// Controller to update a single service status by its ID
import { updateOneServiceStatus } from
  '../controllers/serviceStatus/updateOneServiceStatus.js';
// Controller to delete a single service status by its ID
import { deleteOneServiceStatus } from
  '../controllers/serviceStatus/deleteOneServiceStatus.js';

// Create a new Router instance dedicated to the service status resource
export const serviceStatusRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Create a new service status
// Body: { authentication, newServiceStatusData: { name, description } }
// ─────────────────────────────────────────────────────────────────────────────
serviceStatusRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the creation payload
  validatorHandler(serviceStatusSchema.newServiceStatusData, 'body'),
  // Step 4: delegate to the controller
  createOneServiceStatus
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List all service statuses
// Body: { authentication }
// ─────────────────────────────────────────────────────────────────────────────
serviceStatusRouter.get(
  '/list-all',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all roles
  checkRole(['administrador', 'anunciante', 'cliente']),
  // Step 3: delegate to the controller (no payload to validate)
  listAllServiceStatuses
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one/:id  →  Retrieve a single service status by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
serviceStatusRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all roles
  checkRole(['administrador', 'anunciante', 'cliente']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(serviceStatusSchema.getServiceStatusById, 'params'),
  // Step 4: delegate to the controller
  listOneServiceStatus
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /update/:id  →  Update an existing service status by ID
// Body: { authentication, id, newServiceStatusData: { name?, description? } }
// ─────────────────────────────────────────────────────────────────────────────
serviceStatusRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the update payload
  validatorHandler(serviceStatusSchema.updateServiceStatusData, 'body'),
  // Step 4: delegate to the controller
  updateOneServiceStatus
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete/:id  →  Delete a service status by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
serviceStatusRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(serviceStatusSchema.deleteServiceStatus, 'body'),
  // Step 4: delegate to the controller
  deleteOneServiceStatus
);

// Export the configured router for registration in the main router (index.js)
export default serviceStatusRouter;