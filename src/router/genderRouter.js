// ────────────────────────────────────────────────────────────────────────────
// GENDER ROUTER
// Entity: Gender | Table: genero
//
// Defines and exposes the HTTP endpoints used to manage the "gender"
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
// Mounted at: /app/v1/genders  (see src/router/index.js)
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

// Joi schema collection for the gender entity
import { genderSchema } from '../schemas/genderSchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single gender
import { createOneGender } from
  '../controllers/gender/createOneGender.js';
// Controller to retrieve every gender
import { listAllGenders } from
  '../controllers/gender/listAllGenders.js';
// Controller to retrieve a single gender by its ID
import { listOneGender } from
  '../controllers/gender/listOneGender.js';
// Controller to update a single gender by its ID
import { updateOneGender } from
  '../controllers/gender/updateOneGender.js';
// Controller to delete a single gender by its ID
import { deleteOneGender } from
  '../controllers/gender/deleteOneGender.js';

// Create a new Router instance dedicated to the gender resource
export const genderRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Create a new gender
// Body: { authentication, newGenderData: { name } }
// ─────────────────────────────────────────────────────────────────────────────
genderRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the creation payload
  validatorHandler(genderSchema.newGenderData, 'body'),
  // Step 4: delegate to the controller
  createOneGender
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List all genders
// Body: { authentication }
// ─────────────────────────────────────────────────────────────────────────────
genderRouter.get(
  '/list-all',
  // Step 1: delegate to the controller (no payload to validate)
  listAllGenders
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one/:id  →  Retrieve a single gender by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
genderRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(genderSchema.getGenderById, 'body'),
  // Step 4: delegate to the controller
  listOneGender
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /update/:id  →  Update an existing gender by ID
// Body: { authentication, id, newGenderData: { name? } }
// ─────────────────────────────────────────────────────────────────────────────
genderRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the update payload
  validatorHandler(genderSchema.updateGenderData, 'body'),
  // Step 4: delegate to the controller
  updateOneGender
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete/:id  →  Delete a gender by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
genderRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(genderSchema.deleteGender, 'body'),
  // Step 4: delegate to the controller
  deleteOneGender
);

// Export the configured router for registration in the main router (index.js)
export default genderRouter;