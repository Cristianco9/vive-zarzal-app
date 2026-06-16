// ────────────────────────────────────────────────────────────────────────────
// SERVICE IMAGE ROUTER
// Entity: ServiceImage | Table: imagen_servicio
//
// Defines and exposes the HTTP endpoints used to manage the "serviceImage" entity.
// A service image belongs to exactly one service (serviceId) and stores an image URL
// with an optional description. Every route is protected and only users with 
// appropriate roles are allowed to operate on it.
//
// Security pipeline applied to each route (in order):
//   1. authAppVerifyToken → validates the session JWT and refreshes it.
//   2. checkRole(['administrador', 'anunciante']) → authorizes 
//      based on role-specific permissions for each operation
//   3. validatorHandler(schema, 'body') → validates the incoming payload (Joi).
//   4. controller → executes the business operation and builds the response.
//
// Role-based permissions:
//   - Advertiser (Anunciante): Can create, update, delete (own images), list all, list one
//   - Administrator (Administrador): Can delete any image, list all, list one
//   - Client (Cliente): No access to any endpoints
//
// Mounted at: /app/v1/service-images  (see src/router/index.js)
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

// Joi schema collection for the service image entity
import { serviceImageSchema } from '../schemas/serviceImageSchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single service image
import { createServiceImage } from
  '../controllers/serviceImage/createServiceImage.js';
// Controller to retrieve every service image
import { listAllServiceImages } from
  '../controllers/serviceImage/listAllServiceImages.js';
// Controller to retrieve a single service image by its ID
import { getServiceImageById } from
  '../controllers/serviceImage/getServiceImageById.js';
// Controller to update a single service image by its ID
import { updateServiceImage } from
  '../controllers/serviceImage/updateServiceImage.js';
// Controller to delete a single service image by its ID
import { deleteServiceImage } from
  '../controllers/serviceImage/deleteServiceImage.js';

// Create a new Router instance dedicated to the service image resource
export const serviceImageRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Create a new service image
// Body: { authentication, newServiceImageData: { imageUrl, description?, serviceId } }
// ─────────────────────────────────────────────────────────────────────────────
serviceImageRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the advertiser role
  checkRole(['anunciante']),
  // Step 3: validate the creation payload
  validatorHandler(serviceImageSchema.newServiceImageData, 'body'),
  // Step 4: delegate to the controller
  createServiceImage
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List all service images (with service relations)
// Body: { authentication }
// ─────────────────────────────────────────────────────────────────────────────
serviceImageRouter.get(
  '/list-all',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize advertiser and administrator roles
  checkRole(['anunciante', 'administrador']),
  // Step 3: delegate to the controller (no payload to validate)
  listAllServiceImages
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one/:id  →  Retrieve a single service image by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
serviceImageRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize advertiser and administrator roles
  checkRole(['anunciante', 'administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(serviceImageSchema.getServiceImageById, 'params'),
  // Step 4: delegate to the controller
  getServiceImageById
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /update/:id  →  Update an existing service image by ID
// Body: { authentication, id, businessId, updateServiceImageData: { imageUrl?, 
//         description?, serviceId? } }
// ─────────────────────────────────────────────────────────────────────────────
serviceImageRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the advertiser role
  checkRole(['anunciante']),
  // Step 3: validate the update payload
  validatorHandler(serviceImageSchema.updateServiceImageData, 'body'),
  // Step 4: delegate to the controller
  updateServiceImage
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete/:id  →  Delete a service image by ID (advertiser version - checks ownership)
// Body: { authentication, id, businessId }
// ─────────────────────────────────────────────────────────────────────────────
serviceImageRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the advertiser role
  checkRole(['anunciante']),
  // Step 3: validate the deletion payload
  validatorHandler(serviceImageSchema.deleteServiceImage, 'body'),
  // Step 4: delegate to the controller
  deleteServiceImage
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /admin-delete/:id  →  Delete any service image by ID (administrator version)
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
serviceImageRouter.delete(
  '/admin-delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(serviceImageSchema.getServiceImageById, 'params'),
  // Step 4: delegate to the controller
  deleteServiceImage
);

// Export the configured router for registration in the main router (index.js)
export default serviceImageRouter;