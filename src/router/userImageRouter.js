// ────────────────────────────────────────────────────────────────────────────
// USER IMAGE ROUTER
// Entity: UserImage | Table: imagen_usuario
//
// Defines and exposes the HTTP endpoints used to manage the "user image" entity.
// A user image represents an image associated with a user profile. Each image 
// belongs to exactly one user.
//
// Security pipeline applied to each route (in order):
//   1. authAppVerifyToken → validates the session JWT and refreshes it (if required).
//   2. checkRole([...]) → authorizes based on role-specific permissions
//   3. validatorHandler(schema, 'body') → validates the incoming payload (Joi).
//   4. controller → executes the business operation and builds the response.
//
// Role-based permissions:
//   - Create: Administrator, Client, Advertiser
//   - Delete: Administrator, Client, Advertiser (own images only)
//   - Admin Delete: Administrator only
//   - List All: Administrator only
//   - List One: Administrator only
//   - List by User: Administrator, Client, Advertiser
//   - Update: Administrator, Client, Advertiser (own images only)
//   - Admin Update: Administrator only
//
// Mounted at: /app/v1/user-images  (see src/router/index.js)
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

// Joi schema collection for the user image entity
import { userImageSchema } from '../schemas/userImageSchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single user image
import { createOneUserImage } from '../controllers/userImage/createOneUserImage.js';
// Controller to delete a user image (owned by user)
import { deleteOneUserImage } from '../controllers/userImage/deleteOneUserImage.js';
// Controller to delete a user image (admin only)
import { deleteOneUserImageAdmin } from '../controllers/userImage/deleteOneUserImage.js';
// Controller to retrieve every user image
import { listAllUserImages } from '../controllers/userImage/listAllUserImages.js';
// Controller to retrieve every image belonging to a specific user
import { listAllUserImagesByUser } from '../controllers/userImage/listAllUserImagesByUser.js';
// Controller to retrieve a single user image by its ID
import { listOneUserImage } from '../controllers/userImage/listOneUserImage.js';
// Controller to update a user image (owned by user)
import { updateOneUserImage } from '../controllers/userImage/updateOneUserImage.js';
// Controller to update a user image (admin only)
import { updateOneUserImageAdmin } from '../controllers/userImage/updateOneUserImage.js';

// Create a new Router instance dedicated to the user image resource
export const userImageRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Create a new user image
// Body: { newUserImageData: { userId, url, name, altText } }
// ─────────────────────────────────────────────────────────────────────────────
userImageRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize administrator, client, and advertiser roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: validate the creation payload
  validatorHandler(userImageSchema.newUserImageData, 'body'),
  // Step 4: delegate to the controller
  createOneUserImage
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete/:id  →  Delete a user image (owned by user)
// Params: { id }
// ─────────────────────────────────────────────────────────────────────────────
userImageRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize administrator, client, and advertiser roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(userImageSchema.getUserImageId, 'params'),
  // Step 4: delegate to the controller
  deleteOneUserImage
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /admin-delete/:id  →  Delete any user image (admin only)
// Params: { id }
// ─────────────────────────────────────────────────────────────────────────────
userImageRouter.delete(
  '/admin-delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(userImageSchema.getUserImageId, 'params'),
  // Step 4: delegate to the controller
  deleteOneUserImageAdmin
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List all user images (admin only)
// ─────────────────────────────────────────────────────────────────────────────
userImageRouter.get(
  '/list-all',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: delegate to the controller (no payload to validate)
  listAllUserImages
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one/:id  →  Retrieve a single user image by ID (admin only)
// Params: { id }
// ─────────────────────────────────────────────────────────────────────────────
userImageRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(userImageSchema.getUserImageId, 'params'),
  // Step 4: delegate to the controller
  listOneUserImage
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-by-user/:userId  →  List all images belonging to a specific user
// Params: { userId }
// ─────────────────────────────────────────────────────────────────────────────
userImageRouter.get(
  '/list-by-user/:userId',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize administrator, client, and advertiser roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: validate that a valid user ID was provided
  validatorHandler(userImageSchema.getUserId, 'params'),
  // Step 4: delegate to the controller
  listAllUserImagesByUser
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /update/:id  →  Update a user image (owned by user)
// Params: { id }
// Body: { newUserImageData: { userId?, url?, name?, altText? } }
// ─────────────────────────────────────────────────────────────────────────────
userImageRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize administrator, client, and advertiser roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: validate the update payload
  validatorHandler(userImageSchema.updateUserImageData, 'body'),
  // Step 4: delegate to the controller
  updateOneUserImage
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /admin-update/:id  →  Update any user image (admin only)
// Params: { id }
// Body: { newUserImageData: { userId?, url?, name?, altText? } }
// ─────────────────────────────────────────────────────────────────────────────
userImageRouter.patch(
  '/admin-update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the update payload
  validatorHandler(userImageSchema.updateUserImageData, 'body'),
  // Step 4: delegate to the controller
  updateOneUserImageAdmin
);

// Export the configured router for registration in the main router (index.js)
export default userImageRouter;