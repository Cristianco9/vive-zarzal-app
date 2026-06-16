// ────────────────────────────────────────────────────────────────────────────
// DEPARTMENT ROUTER
// Entity: Department | Table: departamento
//
// Defines and exposes the HTTP endpoints used to manage the "department"
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
// Mounted at: /app/v1/departments  (see src/router/index.js)
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

// Joi schema collection for the department entity
import { departmentSchema } from '../schemas/departmentSchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single department
import { createOneDepartment } from
  '../controllers/department/createOneDepartment.js';
// Controller to retrieve every department
import { listAllDepartments } from
  '../controllers/department/listAllDepartments.js';
// Controller to retrieve a single department by its ID
import { listOneDepartment } from
  '../controllers/department/listOneDepartment.js';
// Controller to update a single department by its ID
import { updateOneDepartment } from
  '../controllers/department/updateOneDepartment.js';
// Controller to delete a single department by its ID
import { deleteOneDepartment } from
  '../controllers/department/deleteOneDepartment.js';

// Create a new Router instance dedicated to the department resource
export const departmentRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Create a new department
// Body: { authentication, newDepartmentData: { countryId, name, description? } }
// ─────────────────────────────────────────────────────────────────────────────
departmentRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the creation payload
  validatorHandler(departmentSchema.newDepartmentData, 'body'),
  // Step 4: delegate to the controller
  createOneDepartment
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List all departments
// Body: { authentication }
// ─────────────────────────────────────────────────────────────────────────────
departmentRouter.get(
  '/list-all',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: delegate to the controller (no payload to validate)
  listAllDepartments
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one/:id  →  Retrieve a single department by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
departmentRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(departmentSchema.getDepartmentById, 'body'),
  // Step 4: delegate to the controller
  listOneDepartment
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /update/:id  →  Update an existing department by ID
// Body: { authentication, id, newDepartmentData: { countryId?, name?, description? } }
// ─────────────────────────────────────────────────────────────────────────────
departmentRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the update payload
  validatorHandler(departmentSchema.updateDepartmentData, 'body'),
  // Step 4: delegate to the controller
  updateOneDepartment
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete/:id  →  Delete a department by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
departmentRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(departmentSchema.deleteDepartment, 'body'),
  // Step 4: delegate to the controller
  deleteOneDepartment
);

// Export the configured router for registration in the main router (index.js)
export default departmentRouter;