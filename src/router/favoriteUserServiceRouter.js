// ────────────────────────────────────────────────────────────────────────────
// FAVORITE USER SERVICE ROUTER
// Entity: ServiceFavorite | Table: servicio_favoritos_usuarios
//
// Defines and exposes the HTTP endpoints used to manage the "favorite user
// service" junction entity (a user marking a service as favorite).
//
// Role matrix:
//   - 'cliente'       → can create, delete, list one, and list by user.
//   - 'administrador' → can ONLY list one, list all and list by user.
//   - 'anunciante'     → has NO access to any route on this resource.
//
// Security pipeline applied to each route (in order):
//   1. authAppVerifyToken → validates the session JWT and refreshes it.
//   2. checkRole([...]) → authorizes only the allowed roles for the action.
//   3. validatorHandler(schema, 'body') → validates the incoming payload (Joi).
//   4. controller → executes the business operation and builds the response.
//
// Mounted at: /app/v1/favorite-user-services  (see src/router/index.js)
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

// Joi schema collection for the favorite user service entity
import { favoriteUserServiceSchema } from '../schemas/favoriteUserServiceSchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single favorite (user-service link)
import { createOneFavoriteUserService } from
  '../controllers/favoriteUserService/createOneFavoriteUserService.js';
// Controller to retrieve every favorite
import { listAllFavoriteUserServices } from
  '../controllers/favoriteUserService/listAllFavoriteUserServices.js';
// Controller to retrieve every favorite belonging to a specific user
import { listAllFavoriteUserServicesByUser } from
  '../controllers/favoriteUserService/listAllFavoriteUserServicesByUser.js';
// Controller to retrieve a single favorite by its ID
import { listOneFavoriteUserService } from
  '../controllers/favoriteUserService/listOneFavoriteUserService.js';
// Controller to delete a single favorite by its ID
import { deleteOneFavoriteUserService } from
  '../controllers/favoriteUserService/deleteOneFavoriteUserService.js';

// Create a new Router instance dedicated to the favorite user service resource
export const favoriteUserServiceRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Mark a service as favorite for a user
// Body: { authentication, newFavoriteData: { userId, serviceId } }
// ─────────────────────────────────────────────────────────────────────────────
favoriteUserServiceRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the client role
  checkRole(['cliente']),
  // Step 3: validate the creation payload
  validatorHandler(favoriteUserServiceSchema.newFavoriteData, 'body'),
  // Step 4: delegate to the controller
  createOneFavoriteUserService
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List every favorite (with related user and service)
// Body: { authentication }
// ─────────────────────────────────────────────────────────────────────────────
favoriteUserServiceRouter.get(
  '/list-all',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: delegate to the controller (no payload to validate)
  listAllFavoriteUserServices
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all-by-user/:id  →  List every favorite belonging to a specific user
// Body: { authentication, userId }
// ─────────────────────────────────────────────────────────────────────────────
favoriteUserServiceRouter.get(
  '/list-all-by-user/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize the administrator and the client role
  checkRole(['administrador', 'cliente']),
  // Step 3: validate that a valid user ID was provided
  validatorHandler(favoriteUserServiceSchema.getFavoritesByUserId, 'body'),
  // Step 4: delegate to the controller
  listAllFavoriteUserServicesByUser
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one/:id  →  Retrieve a single favorite by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
favoriteUserServiceRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize the administrator and the client role
  checkRole(['administrador', 'cliente']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(favoriteUserServiceSchema.getFavoriteById, 'body'),
  // Step 4: delegate to the controller
  listOneFavoriteUserService
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete/:id  →  Remove a favorite by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
favoriteUserServiceRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the client role
  checkRole(['cliente']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(favoriteUserServiceSchema.deleteFavorite, 'body'),
  // Step 4: delegate to the controller
  deleteOneFavoriteUserService
);

// Export the configured router for registration in the main router (index.js)
export default favoriteUserServiceRouter;