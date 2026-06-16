// ────────────────────────────────────────────────────────────────────────────
// BUSINESS ROUTER
// Entity: Business | Table: negocio
//
// Defines and exposes the HTTP endpoints used to manage the "business" entity.
// A business is owned by exactly one user (ownerUserId) and may optionally be
// tied to a location (locationId). Every route is protected and only users
// whose JWT carries the 'anunciante' role are allowed to operate on it.
//
// Security pipeline applied to each route (in order):
//   1. authAppVerifyToken → validates the session JWT and refreshes it.
//   2. checkRole(['administrador', 'anunciante', 'cliente]) → authorizes 
//      only the advertiser role to create, update, and delete. And the
//      administrator can delete
//   3. validatorHandler(schema, 'body') → validates the incoming payload (Joi).
//   4. controller → executes the business operation and builds the response.
//
// Mounted at: /app/v1/businesses  (see src/router/index.js)
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

// Joi schema collection for the business entity
import { businessSchema } from '../schemas/businessSchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single business
import { createOneBusiness } from
  '../controllers/business/createOneBusiness.js';
// Controller to retrieve every business
import { listAllBusinesses } from
  '../controllers/business/listAllBusinesses.js';
// Controller to retrieve a single business by its ID
import { listOneBusiness } from
  '../controllers/business/listOneBusiness.js';
// Controller to update a single business by its ID
import { updateOneBusiness } from
  '../controllers/business/updateOneBusiness.js';
// Controller to delete a single business by its ID
import { deleteOneBusiness } from
  '../controllers/business/deleteOneBusiness.js';

// Create a new Router instance dedicated to the business resource
export const businessRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /  →  Create a new business
// Body: { authentication, newBusinessData: { ownerUserId, name, locationId?,
//         description?, facebook?, instagram?, tiktok?, website? } }
// ─────────────────────────────────────────────────────────────────────────────
businessRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the advertiser role
  checkRole(['anunciante']),
  // Step 3: validate the creation payload
  validatorHandler(businessSchema.newBusinessData, 'body'),
  // Step 4: delegate to the controller
  createOneBusiness
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /  →  List all businesses (with owner and location relations)
// Body: { authentication }
// ─────────────────────────────────────────────────────────────────────────────
businessRouter.get(
  '/list-all',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: delegate to the controller (no payload to validate)
  listAllBusinesses
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /:id  →  Retrieve a single business by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
businessRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(businessSchema.getBusinessById, 'body'),
  // Step 4: delegate to the controller
  listOneBusiness
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /:id  →  Update an existing business by ID
// Body: { authentication, id, newBusinessData: { name?, locationId?,
//         description?, facebook?, instagram?, tiktok?, website? } }
// ─────────────────────────────────────────────────────────────────────────────
businessRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the advertiser role
  checkRole(['anunciante']),
  // Step 3: validate the update payload
  validatorHandler(businessSchema.updateBusinessData, 'body'),
  // Step 4: delegate to the controller
  updateOneBusiness
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /:id  →  Delete a business by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
businessRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator and advertiser role
  checkRole(['administrador','anunciante']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(businessSchema.deleteBusiness, 'body'),
  // Step 4: delegate to the controller
  deleteOneBusiness
);

// Export the configured router for registration in the main router (index.js)
export default businessRouter;