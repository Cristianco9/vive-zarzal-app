// ────────────────────────────────────────────────────────────────────────────
// CATEGORY ROUTER
// Entity: Category | Table: categoria
//
// Defines and exposes the HTTP endpoints used to manage the "category"
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
// Mounted at: /app/v1/categories  (see src/router/index.js)
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

// Joi schema collection for the category entity
import { categorySchema } from '../schemas/categorySchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single category
import { createOneCategory } from
  '../controllers/category/createOneCategory.js';
// Controller to retrieve every category
import { listAllCategories } from
  '../controllers/category/listAllCategories.js';
// Controller to retrieve a single category by its ID
import { listOneCategory } from
  '../controllers/category/listOneCategory.js';
// Controller to update a single category by its ID
import { updateOneCategory } from
  '../controllers/category/updateOneCategory.js';
// Controller to delete a single category by its ID
import { deleteOneCategory } from
  '../controllers/category/deleteOneCategory.js';

// Create a new Router instance dedicated to the category resource
export const categoryRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Create a new category
// Body: { authentication, newCategoryData: { name, description? } }
// ─────────────────────────────────────────────────────────────────────────────
categoryRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the creation payload
  validatorHandler(categorySchema.newCategoryData, 'body'),
  // Step 4: delegate to the controller
  createOneCategory
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List all categories
// Body: { authentication }
// ─────────────────────────────────────────────────────────────────────────────
categoryRouter.get(
  '/list-all',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: delegate to the controller (no payload to validate)
  listAllCategories
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one/:id  →  Retrieve a single category by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
categoryRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(categorySchema.getCategoryById, 'body'),
  // Step 4: delegate to the controller
  listOneCategory
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /update-one/:id  →  Update an existing category by ID
// Body: { authentication, id, newCategoryData: { name?, description? } }
// ─────────────────────────────────────────────────────────────────────────────
categoryRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the update payload
  validatorHandler(categorySchema.updateCategoryData, 'body'),
  // Step 4: delegate to the controller
  updateOneCategory
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete/:id  →  Delete a category by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
categoryRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(categorySchema.deleteCategory, 'body'),
  // Step 4: delegate to the controller
  deleteOneCategory
);

// Export the configured router for registration in the main router (index.js)
export default categoryRouter;