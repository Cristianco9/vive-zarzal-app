// ────────────────────────────────────────────────────────────────────────────
// SERVICE REVIEW ROUTER
// Entity: ServiceReview | Table: reseña_servicio
//
// Defines and exposes the HTTP endpoints used to manage the "serviceReview" entity.
// A service review belongs to exactly one service (serviceId) and one user (userId),
// storing an optional content and rating. Every route is protected and only users 
// with appropriate roles are allowed to operate on it.
//
// Security pipeline applied to each route (in order):
//   1. authAppVerifyToken → validates the session JWT and refreshes it.
//   2. checkRole(['administrador', 'anunciante', 'cliente']) → authorizes 
//      based on role-specific permissions for each operation
//   3. validatorHandler(schema, 'body') → validates the incoming payload (Joi).
//   4. controller → executes the business operation and builds the response.
//
// Role-based permissions:
//   - Client (Cliente): Can create, update (own reviews), delete (own reviews), 
//                       list one, list all, list reviews by user ID
//   - Advertiser (Anunciante): Can list one, list all
//   - Administrator (Administrador): Can delete any review, list one, list all, 
//                                   list reviews by user ID
//
// Mounted at: /app/v1/service-reviews  (see src/router/index.js)
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

// Joi schema collection for the service review entity
import { serviceReviewSchema } from '../schemas/serviceReviewSchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single service review
import { createServiceReview } from
  '../controllers/serviceReview/createServiceReview.js';
// Controller to retrieve every service review
import { listAllServiceReviews } from
  '../controllers/serviceReview/listAllServiceReviews.js';
// Controller to retrieve a single service review by its ID
import { getServiceReviewById } from
  '../controllers/serviceReview/getServiceReviewById.js';
// Controller to update a single service review by its ID
import { updateServiceReview } from
  '../controllers/serviceReview/updateServiceReview.js';
// Controller to delete a single service review by its ID
import { deleteServiceReview } from
  '../controllers/serviceReview/deleteServiceReview.js';
// Controller to list service reviews by user ID
import { listServiceReviewsByUser } from
  '../controllers/serviceReview/listServiceReviewsByUser.js';

// Create a new Router instance dedicated to the service review resource
export const serviceReviewRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Create a new service review
// Body: { authentication, newServiceReviewData: { serviceId, userId, content?, rating? } }
// ─────────────────────────────────────────────────────────────────────────────
serviceReviewRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the client role
  checkRole(['cliente']),
  // Step 3: validate the creation payload
  validatorHandler(serviceReviewSchema.newServiceReviewData, 'body'),
  // Step 4: delegate to the controller
  createServiceReview
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List all service reviews (with service and user relations)
// Body: { authentication }
// ─────────────────────────────────────────────────────────────────────────────
serviceReviewRouter.get(
  '/list-all',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize client, advertiser, and administrator roles
  checkRole(['cliente', 'anunciante', 'administrador']),
  // Step 3: delegate to the controller (no payload to validate)
  listAllServiceReviews
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one/:id  →  Retrieve a single service review by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
serviceReviewRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize client, advertiser, and administrator roles
  checkRole(['cliente', 'anunciante', 'administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(serviceReviewSchema.getServiceReviewById, 'params'),
  // Step 4: delegate to the controller
  getServiceReviewById
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /update/:id  →  Update an existing service review by ID
// Body: { authentication, id, userId, updateServiceReviewData: { serviceId?, 
//         userId?, content?, rating? } }
// ─────────────────────────────────────────────────────────────────────────────
serviceReviewRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the client role
  checkRole(['cliente']),
  // Step 3: validate the update payload
  validatorHandler(serviceReviewSchema.updateServiceReviewData, 'body'),
  // Step 4: delegate to the controller
  updateServiceReview
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete/:id  →  Delete a service review by ID (client version - checks ownership)
// Body: { authentication, id, userId }
// ─────────────────────────────────────────────────────────────────────────────
serviceReviewRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the client role
  checkRole(['cliente']),
  // Step 3: validate the deletion payload
  validatorHandler(serviceReviewSchema.deleteServiceReview, 'body'),
  // Step 4: delegate to the controller
  deleteServiceReview
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /admin-delete/:id  →  Delete any service review by ID (administrator version)
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
serviceReviewRouter.delete(
  '/admin-delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(serviceReviewSchema.getServiceReviewById, 'params'),
  // Step 4: delegate to the controller
  deleteServiceReview
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /user/:userId  →  List all service reviews for a specific user
// Body: { authentication, userId }
// ─────────────────────────────────────────────────────────────────────────────
serviceReviewRouter.get(
  '/user/:userId',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize client and administrator roles
  checkRole(['cliente', 'administrador']),
  // Step 3: validate that a valid user ID was provided
  validatorHandler(serviceReviewSchema.getServiceReviewsByUserId, 'params'),
  // Step 4: delegate to the controller
  listServiceReviewsByUser
);

// Export the configured router for registration in the main router (index.js)
export default serviceReviewRouter;