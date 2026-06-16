// ────────────────────────────────────────────────────────────────────────────
// LOCATION ROUTER
// Entity: Location | Table: ubicacion
//
// Defines and exposes the HTTP endpoints used to manage the "location"
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
// Mounted at: /app/v1/locations  (see src/router/index.js)
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

// Joi schema collection for the location entity
import { locationSchema } from '../schemas/locationSchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single location
import { createOneLocation } from
  '../controllers/location/createOneLocation.js';
// Controller to retrieve every location
import { listAllLocations } from
  '../controllers/location/listAllLocations.js';
// Controller to retrieve a single location by its ID
import { listOneLocation } from
  '../controllers/location/listOneLocation.js';
// Controller to update a single location by its ID
import { updateOneLocation } from
  '../controllers/location/updateOneLocation.js';
// Controller to delete a single location by its ID
import { deleteOneLocation } from
  '../controllers/location/deleteOneLocation.js';

// Create a new Router instance dedicated to the location resource
export const locationRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Create a new location
// Body: { authentication, newLocationData: { cityId, name, description?, code? } }
// ─────────────────────────────────────────────────────────────────────────────
locationRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the creation payload
  validatorHandler(locationSchema.newLocationData, 'body'),
  // Step 4: delegate to the controller
  createOneLocation
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List all locations
// Body: { authentication }
// ─────────────────────────────────────────────────────────────────────────────
locationRouter.get(
  '/list-all',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: delegate to the controller (no payload to validate)
  listAllLocations
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one/:id  →  Retrieve a single location by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
locationRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(locationSchema.getLocationById, 'body'),
  // Step 4: delegate to the controller
  listOneLocation
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /update/:id  →  Update an existing location by ID
// Body: { authentication, id, newLocationData: { cityId?, name?, description?, code? } }
// ─────────────────────────────────────────────────────────────────────────────
locationRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the update payload
  validatorHandler(locationSchema.updateLocationData, 'body'),
  // Step 4: delegate to the controller
  updateOneLocation
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete/:id  →  Delete a location by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
locationRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(locationSchema.deleteLocation, 'body'),
  // Step 4: delegate to the controller
  deleteOneLocation
);

// Export the configured router for registration in the main router (index.js)
export default locationRouter;