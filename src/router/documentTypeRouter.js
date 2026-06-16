// ────────────────────────────────────────────────────────────────────────────
// DOCUMENT TYPE ROUTER
// Entity: DocumentType | Table: tipo_documento
//
// Defines and exposes the HTTP endpoints used to manage the "document type"
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
// Mounted at: /app/v1/document-types  (see src/router/index.js)
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

// Joi schema collection for the document type entity
import { documentTypeSchema } from '../schemas/documentTypeSchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single document type
import { createOneDocumentType } from
  '../controllers/documentType/createOneDocumentType.js';
// Controller to retrieve every document type
import { listAllDocumentTypes } from
  '../controllers/documentType/listAllDocumentTypes.js';
// Controller to retrieve a single document type by its ID
import { listOneDocumentType } from
  '../controllers/documentType/listOneDocumentType.js';
// Controller to update a single document type by its ID
import { updateOneDocumentType } from
  '../controllers/documentType/updateOneDocumentType.js';
// Controller to delete a single document type by its ID
import { deleteOneDocumentType } from
  '../controllers/documentType/deleteOneDocumentType.js';

// Create a new Router instance dedicated to the document type resource
export const documentTypeRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Create a new document type
// Body: { authentication, newDocumentTypeData: { name } }
// ─────────────────────────────────────────────────────────────────────────────
documentTypeRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the creation payload
  validatorHandler(documentTypeSchema.newDocumentTypeData, 'body'),
  // Step 4: delegate to the controller
  createOneDocumentType
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List all document types
// Body: { authentication }
// ─────────────────────────────────────────────────────────────────────────────
documentTypeRouter.get(
  '/list-all',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: delegate to the controller (no payload to validate)
  listAllDocumentTypes
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one/:id  →  Retrieve a single document type by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
documentTypeRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(documentTypeSchema.getDocumentTypeById, 'body'),
  // Step 4: delegate to the controller
  listOneDocumentType
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /update-one/:id  →  Update an existing document type by ID
// Body: { authentication, id, newDocumentTypeData: { name? } }
// ─────────────────────────────────────────────────────────────────────────────
documentTypeRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the update payload
  validatorHandler(documentTypeSchema.updateDocumentTypeData, 'body'),
  // Step 4: delegate to the controller
  updateOneDocumentType
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete/:id  →  Delete a document type by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
documentTypeRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(documentTypeSchema.deleteDocumentType, 'body'),
  // Step 4: delegate to the controller
  deleteOneDocumentType
);

// Export the configured router for registration in the main router (index.js)
export default documentTypeRouter;