// ────────────────────────────────────────────────────────────────────────────
// SERVICE ROUTER
// Entity: Service | Table: servicio
//
// Defines and exposes the HTTP endpoints used to manage the "service" entity.
// A service belongs to exactly one business (businessId) and may optionally be
// tied to a category (categoryId), status (statusId) and age restriction (ageRestrictionId).
// Every route is protected and only users with appropriate roles are allowed to operate on it.
//
// Security pipeline applied to each route (in order):
//   1. authAppVerifyToken → validates the session JWT and refreshes it.
//   2. checkRole(['administrador', 'anunciante', 'cliente]) → authorizes 
//      based on role-specific permissions for each operation
//   3. validatorHandler(schema, 'body') → validates the incoming payload (Joi).
//   4. controller → executes the business operation and builds the response.
//
// Role-based permissions:
//   - Advertiser (Anunciante): Can create, update, delete (own services), 
//     list all, list one, list services by business
//   - Client (Cliente): Can list all, list one service
//   - Administrator (Administrador): Can delete any service, list all, list one service
//
// Mounted at: /app/v1/services  (see src/router/index.js)
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

// Joi schema collection for the service entity
import { serviceSchema } from '../schemas/serviceSchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single service
import { createService } from
  '../controllers/service/createOneService.js';
// Controller to retrieve every service
import { listAllServices } from
  '../controllers/service/listAllServices.js';
// Controller to retrieve a single service by its ID
import { getServiceById } from
  '../controllers/service/listOneService.js';
// Controller to update a single service by its ID
import { updateOneService } from
  '../controllers/service/updateOneService.js';
// Controller to delete a single service by its ID
import { deleteService } from
  '../controllers/service/deleteOneService.js';
// Controller to list services by business ID
import { listServicesByBusiness } from
  '../controllers/service/listByBusinessId.js';

// Create a new Router instance dedicated to the service resource
export const serviceRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Create a new service
// Body: { authentication, newServiceData: { name, description?, price, categoryId, 
//         statusId, ageRestrictionId?, businessId } }
// ─────────────────────────────────────────────────────────────────────────────
serviceRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the advertiser role
  checkRole(['anunciante']),
  // Step 3: validate the creation payload
  validatorHandler(serviceSchema.newServiceData, 'body'),
  // Step 4: delegate to the controller
  createService
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List all services (with category, status, age restriction and business relations)
// Body: { authentication }
// ─────────────────────────────────────────────────────────────────────────────
serviceRouter.get(
  '/list-all',
  // Step 1: delegate to the controller (no payload to validate)
  listAllServices
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one/:id  →  Retrieve a single service by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
serviceRouter.get(
  '/list-one/:id',
  // Step 1: validate that a valid ID was provided
  validatorHandler(serviceSchema.getServiceById, 'params'),
  // Step 2: delegate to the controller
  getServiceById
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /update/:id  →  Update an existing service by ID
// Body: { authentication, id, businessId, updateServiceData: { name?, description?, 
//         price?, categoryId?, statusId?, ageRestrictionId?, businessId? } }
// ─────────────────────────────────────────────────────────────────────────────
serviceRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the advertiser role
  checkRole(['anunciante']),
  // Step 3: validate the update payload
  validatorHandler(serviceSchema.updateServiceData, 'body'),
  // Step 4: delegate to the controller
  updateOneService
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete/:id  →  Delete a service by ID (advertiser version - checks ownership)
// Body: { authentication, id, businessId }
// ─────────────────────────────────────────────────────────────────────────────
serviceRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the advertiser role
  checkRole(['anunciante']),
  // Step 3: validate the deletion payload
  validatorHandler(serviceSchema.deleteService, 'body'),
  // Step 4: delegate to the controller
  deleteService
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /admin-delete/:id  →  Delete any service by ID (administrator version)
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
serviceRouter.delete(
  '/admin-delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(serviceSchema.getServiceById, 'params'),
  // Step 4: delegate to the controller
  deleteService
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /business/:businessId  →  List all services for a specific business
// Body: { authentication, businessId }
// ─────────────────────────────────────────────────────────────────────────────
serviceRouter.get(
  '/business/:businessId',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the advertiser role
  checkRole(['anunciante']),
  // Step 3: validate that a valid business ID was provided
  validatorHandler(serviceSchema.getServicesByBusinessId, 'params'),
  // Step 4: delegate to the controller
  listServicesByBusiness
);

// Export the configured router for registration in the main router (index.js)
export default serviceRouter;