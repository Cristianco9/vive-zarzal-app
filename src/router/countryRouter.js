// ────────────────────────────────────────────────────────────────────────────
// COUNTRY ROUTER
// Entity: Country | Table: pais
//
// Defines and exposes the HTTP endpoints used to manage the "country"
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
// Mounted at: /app/v1/countries  (see src/router/index.js)
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

// Joi schema collection for the country entity
import { countrySchema } from '../schemas/countrySchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single country
import { createOneCountry } from
  '../controllers/country/createOneCountry.js';
// Controller to retrieve every country
import { listAllCountries } from
  '../controllers/country/listAllCountries.js';
// Controller to retrieve a single country by its ID
import { listOneCountry } from
  '../controllers/country/listOneCountry.js';
// Controller to update a single country by its ID
import { updateOneCountry } from
  '../controllers/country/updateOneCountry.js';
// Controller to delete a single country by its ID
import { deleteOneCountry } from
  '../controllers/country/deleteOneCountry.js';

// Create a new Router instance dedicated to the country resource
export const countryRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Create a new country
// Body: { authentication, newCountryData: { name, description? } }
// ─────────────────────────────────────────────────────────────────────────────
countryRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the creation payload
  validatorHandler(countrySchema.newCountryData, 'body'),
  // Step 4: delegate to the controller
  createOneCountry
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List all countries
// Body: { authentication }
// ─────────────────────────────────────────────────────────────────────────────
countryRouter.get(
  '/list-all',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: delegate to the controller (no payload to validate)
  listAllCountries
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one/:id  →  Retrieve a single country by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
countryRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(countrySchema.getCountryById, 'body'),
  // Step 4: delegate to the controller
  listOneCountry
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /update-one/:id  →  Update an existing country by ID
// Body: { authentication, id, newCountryData: { name?, description? } }
// ─────────────────────────────────────────────────────────────────────────────
countryRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the update payload
  validatorHandler(countrySchema.updateCountryData, 'body'),
  // Step 4: delegate to the controller
  updateOneCountry
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete/:id  →  Delete a country by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
countryRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(countrySchema.deleteCountry, 'body'),
  // Step 4: delegate to the controller
  deleteOneCountry
);

// Export the configured router for registration in the main router (index.js)
export default countryRouter;