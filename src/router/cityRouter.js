// ────────────────────────────────────────────────────────────────────────────
// CITY ROUTER
// Entity: City | Table: ciudad
//
// Defines and exposes the HTTP endpoints used to manage the "city"
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
// Mounted at: /app/v1/cities  (see src/router/index.js)
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

// Joi schema collection for the city entity
import { citySchema } from '../schemas/citySchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single city
import { createOneCity } from
  '../controllers/city/createOneCity.js';
// Controller to retrieve every city
import { listAllCities } from
  '../controllers/city/listAllCities.js';
// Controller to retrieve a single city by its ID
import { listOneCity } from
  '../controllers/city/listOneCity.js';
// Controller to update a single city by its ID
import { updateOneCity } from
  '../controllers/city/updateOneCity.js';
// Controller to delete a single city by its ID
import { deleteOneCity } from
  '../controllers/city/deleteOneCity.js';

// Create a new Router instance dedicated to the city resource
export const cityRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Create a new city
// Body: { authentication, newCityData: { departmentId, name, description? } }
// ─────────────────────────────────────────────────────────────────────────────
cityRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the creation payload
  validatorHandler(citySchema.newCityData, 'body'),
  // Step 4: delegate to the controller
  createOneCity
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List all cities
// Body: { authentication }
// ─────────────────────────────────────────────────────────────────────────────
cityRouter.get(
  '/list-all',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: delegate to the controller (no payload to validate)
  listAllCities
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one/:id  →  Retrieve a single city by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
cityRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(citySchema.getCityById, 'body'),
  // Step 4: delegate to the controller
  listOneCity
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /update-one/:id  →  Update an existing city by ID
// Body: { authentication, id, newCityData: { departmentId?, name?, description? } }
// ─────────────────────────────────────────────────────────────────────────────
cityRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the update payload
  validatorHandler(citySchema.updateCityData, 'body'),
  // Step 4: delegate to the controller
  updateOneCity
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete/:id  →  Delete a city by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
cityRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(citySchema.deleteCity, 'body'),
  // Step 4: delegate to the controller
  deleteOneCity
);

// Export the configured router for registration in the main router (index.js)
export default cityRouter;