// ────────────────────────────────────────────────────────────────────────────
// BUSINESS REVIEW ROUTER
// Entity: BusinessReview | Table: resena_negocio
//
// Defines and exposes the HTTP endpoints used to manage the "business review"
// entity. A business review is written by a client (userId) about a business
// (businessId). Every route is protected:
//   - 'cliente'      → can create, update, delete, and list (all/one).
//   - 'anunciante'    → can only list (all/one).
//   - 'administrador' → can only list (all/one) and delete.
//
// Security pipeline applied to each route (in order):
//   1. authAppVerifyToken → validates the session JWT and refreshes it.
//   2. checkRole([...]) → authorizes only the allowed roles for the action.
//   3. validatorHandler(schema, 'body') → validates the incoming payload (Joi).
//   4. controller → executes the business operation and builds the response.
//
// Mounted at: /app/v1/business-reviews  (see src/router/index.js)
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

// Joi schema collection for the business review entity
import { businessReviewSchema } from '../schemas/businessReviewSchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single business review
import { createOneBusinessReview } from
  '../controllers/businessReview/createOneBusinessReview.js';
// Controller to retrieve every business review
import { listAllBusinessReviews } from
  '../controllers/businessReview/listAllBusinessReviews.js';
// Controller to retrieve a single business review by its ID
import { listOneBusinessReview } from
  '../controllers/businessReview/listOneBusinessReview.js';
// Controller to update a single business review by its ID
import { updateOneBusinessReview } from
  '../controllers/businessReview/updateOneBusinessReview.js';
// Controller to delete a single business review by its ID
import { deleteOneBusinessReview } from
  '../controllers/businessReview/deleteOneBusinessReview.js';

// Create a new Router instance dedicated to the business review resource
export const businessReviewRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Create a new business review
// Body: { authentication, newBusinessReviewData: { businessId, userId,
//         rating, content? } }
// ─────────────────────────────────────────────────────────────────────────────
businessReviewRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the client role
  checkRole(['cliente']),
  // Step 3: validate the creation payload
  validatorHandler(businessReviewSchema.newBusinessReviewData, 'body'),
  // Step 4: delegate to the controller
  createOneBusinessReview
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List all business reviews
// Body: { authentication }
// ─────────────────────────────────────────────────────────────────────────────
businessReviewRouter.get(
  '/list-all',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: delegate to the controller (no payload to validate)
  listAllBusinessReviews
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one/:id  →  Retrieve a single business review by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
businessReviewRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(businessReviewSchema.getBusinessReviewById, 'body'),
  // Step 4: delegate to the controller
  listOneBusinessReview
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /update/:id  →  Update an existing business review by ID
// Body: { authentication, id, newBusinessReviewData: { rating?, content? } }
// ─────────────────────────────────────────────────────────────────────────────
businessReviewRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the client role
  checkRole(['cliente']),
  // Step 3: validate the update payload
  validatorHandler(businessReviewSchema.updateBusinessReviewData, 'body'),
  // Step 4: delegate to the controller
  updateOneBusinessReview
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete/:id  →  Delete a business review by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
businessReviewRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator and client role
  checkRole(['administrador', 'cliente']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(businessReviewSchema.deleteBusinessReview, 'body'),
  // Step 4: delegate to the controller
  deleteOneBusinessReview
);

// Export the configured router for registration in the main router (index.js)
export default businessReviewRouter;