// ────────────────────────────────────────────────────────────────────────────
// USER ROUTER
// Entity: User | Table: usuario
//
// Defines and exposes the HTTP endpoints used to manage the "user" entity.
// A user represents a person registered in the system with credentials and profile data.
// Each user belongs to exactly one gender, one role and one document type.
//
// Security pipeline applied to each route (in order):
//   1. authAppVerifyToken → validates the session JWT and refreshes it (if required).
//   2. checkRole([...]) → authorizes based on role-specific permissions
//   3. validatorHandler(schema, 'body') → validates the incoming payload (Joi).
//   4. controller → executes the business operation and builds the response.
//
// Role-based permissions:
//   - Create: No authentication required
//   - Delete: Administrator only
//   - Delete Own Account: Client, Advertiser
//   - Find by Email: Administrator only
//   - List All: Administrator only
//   - List One: Administrator only
//   - Login: No authentication required
//   - Password Recovery: Administrator, Client, Advertiser
//   - Update: Client, Advertiser
//
// Mounted at: /app/v1/users  (see src/router/index.js)
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

// Joi schema collection for the user entity
import { userSchema } from '../schemas/userSchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single user
import { createOneUser } from '../controllers/user/createOneUser.js';
// Controller to delete a single user by its ID (admin only)
import { deleteOneUser } from '../controllers/user/deleteOneUser.js';
// Controller to allow users to delete their own account
import { deleteOwnAccount } from '../controllers/user/deleteOwnAccount.js';
// Controller to find a user by email
import { findUserByEmail } from '../controllers/user/findUserByEmail.js';
// Controller to retrieve every user
import { listAllUsers } from '../controllers/user/listAllUsers.js';
// Controller to retrieve a single user by its ID
import { listOneUser } from '../controllers/user/listOneUser.js';
// Controller to handle user login
import { loginUser } from '../controllers/user/loginUser.js';
// Controller to handle password recovery
import { recoverUserPassword } from '../controllers/user/recoverUserPassword.js';
// Controller to update a single user by its ID
import { updateOneUser } from '../controllers/user/updateOneUser.js';

// Create a new Router instance dedicated to the user resource
export const userRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Create a new user
// Body: { newUserData: { roleId, genderId, documentTypeId, firstName, lastName,
//                        birthDate, documentNumber, email, username, password } }
// ─────────────────────────────────────────────────────────────────────────────
userRouter.post(
  '/create',
  // Step 1: validate the creation payload
  validatorHandler(userSchema.newUserData, 'body'),
  // Step 2: delegate to the controller
  createOneUser
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete/:id  →  Delete a user by ID (admin only)
// Params: { id }
// ─────────────────────────────────────────────────────────────────────────────
userRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(userSchema.getUserId, 'params'),
  // Step 4: delegate to the controller
  deleteOneUser
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete-own/:id  →  Allow user to delete their own account
// Params: { id }
// ─────────────────────────────────────────────────────────────────────────────
userRouter.delete(
  '/delete-own/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize client and advertiser roles
  checkRole(['cliente', 'anunciante']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(userSchema.getUserId, 'params'),
  // Step 4: delegate to the controller
  deleteOwnAccount
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /find-by-email/:email  →  Find a user by email (admin only)
// Params: { email }
// ─────────────────────────────────────────────────────────────────────────────
userRouter.get(
  '/find-by-email/:email',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid email was provided
  validatorHandler(userSchema.getUserByEmail, 'params'),
  // Step 4: delegate to the controller
  findUserByEmail
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List all users (admin only)
// ─────────────────────────────────────────────────────────────────────────────
userRouter.get(
  '/list-all',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: delegate to the controller (no payload to validate)
  listAllUsers
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one/:id  →  Retrieve a single user by ID (admin only)
// Params: { id }
// ─────────────────────────────────────────────────────────────────────────────
userRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(userSchema.getUserId, 'params'),
  // Step 4: delegate to the controller
  listOneUser
);

// ─────────────────────────────────────────────────────────────────────────────
// POST /login  →  Authenticate a user and generate session tokens
// Body: { loginCredentials: { username, password } }
// ─────────────────────────────────────────────────────────────────────────────
userRouter.post(
  '/login',
  // Step 1: validate the login credentials
  validatorHandler(userSchema.loginCredentials, 'body'),
  // Step 2: delegate to the controller
  loginUser
);

// ─────────────────────────────────────────────────────────────────────────────
// POST /recover-password  →  Initiate password recovery process
// Body: { passwordRecoveryData: { email, newPassword } }
// ─────────────────────────────────────────────────────────────────────────────
userRouter.post(
  '/recover-password',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize administrator, client, and advertiser roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: validate the password recovery payload
  validatorHandler(userSchema.passwordRecoveryData, 'body'),
  // Step 4: delegate to the controller
  recoverUserPassword
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /update/:id  →  Update an existing user by ID
// Params: { id }
// Body: { updateUserData: { roleId?, genderId?, documentTypeId?, firstName?, 
//         lastName?, birthDate?, documentNumber?, email?, username?, password? } }
// ─────────────────────────────────────────────────────────────────────────────
userRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize client and advertiser roles
  checkRole(['cliente', 'anunciante']),
  // Step 3: validate the update payload
  validatorHandler(userSchema.updateUserData, 'body'),
  // Step 4: delegate to the controller
  updateOneUser
);

// Export the configured router for registration in the main router (index.js)
export default userRouter;