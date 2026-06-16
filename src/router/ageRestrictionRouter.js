// ────────────────────────────────────────────────────────────────────────────
// AGE RESTRICTION ROUTER
// Entity: AgeRestriction | Table: restriccion_edad
//
// Defines and exposes the HTTP endpoints used to manage the "age restriction"
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
// Mounted at: /app/v1/age-restrictions  (see src/router/index.js)
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

// Joi schema collection for the age restriction entity
import { ageRestrictionSchema } from '../schemas/ageRestrictionSchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single age restriction
import { createOneAgeRestriction } from
  '../controllers/ageRestriction/createOneAgeRestriction.js';
// Controller to retrieve every age restriction
import { listAllAgeRestrictions } from
  '../controllers/ageRestriction/listAllAgeRestrictions.js';
// Controller to retrieve a single age restriction by its ID
import { listOneAgeRestriction } from
  '../controllers/ageRestriction/listOneAgeRestriction.js';
// Controller to update a single age restriction by its ID
import { updateOneAgeRestriction } from
  '../controllers/ageRestriction/updateOneAgeRestriction.js';
// Controller to delete a single age restriction by its ID
import { deleteOneAgeRestriction } from
  '../controllers/ageRestriction/deleteOneAgeRestriction.js';

// Create a new Router instance dedicated to the age restriction resource
export const ageRestrictionRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /  →  Create a new age restriction
// Body: { authentication, newAgeRestrictionData: { name, description? } }
// ─────────────────────────────────────────────────────────────────────────────
ageRestrictionRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the creation payload
  validatorHandler(ageRestrictionSchema.newAgeRestrictionData, 'body'),
  // Step 4: delegate to the controller
  createOneAgeRestriction
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /  →  List all age restrictions
// Body: { authentication }
// ─────────────────────────────────────────────────────────────────────────────
ageRestrictionRouter.get(
  '/list-all',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: delegate to the controller (no payload to validate)
  listAllAgeRestrictions
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /:id  →  Retrieve a single age restriction by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
ageRestrictionRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(ageRestrictionSchema.getAgeRestrictionById, 'body'),
  // Step 4: delegate to the controller
  listOneAgeRestriction
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /:id  →  Update an existing age restriction by ID
// Body: { authentication, id, newAgeRestrictionData: { name?, description? } }
// ─────────────────────────────────────────────────────────────────────────────
ageRestrictionRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the update payload
  validatorHandler(ageRestrictionSchema.updateAgeRestrictionData, 'body'),
  // Step 4: delegate to the controller
  updateOneAgeRestriction
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /:id  →  Delete an age restriction by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
ageRestrictionRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(ageRestrictionSchema.deleteAgeRestriction, 'body'),
  // Step 4: delegate to the controller
  deleteOneAgeRestriction
);

// Export the configured router for registration in the main router (index.js)
export default ageRestrictionRouter;