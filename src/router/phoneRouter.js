// ────
// PHONE ROUTER
// Entity: Phone | Table: telefono
//
// Role matrix:
//   - 'cliente' / 'anunciante' → can create, update, delete and list their phones.
//   - 'administrador'          → can ONLY list all and list one.
// 
// Security pipeline applied to each route (in order):
//   1. authAppVerifyToken → validates JWT and refreshes it.
//   2. checkRole([...]) → authorizes based on allowed roles.
//   3. validatorHandler(schema, 'body') → validates payload (Joi) when applicable.
//   4. controller → executes the operation.
// 
// Mounted at: /app/v1/phones  (see src/router/index.js)
// ────

import { Router } from 'express';

// Middlewares
import { authAppVerifyToken } from '../middlewares/tokenHandlers/authAppTokenHandler.js';
import { checkRole } from '../middlewares/checkRoleHandler.js';
import { validatorHandler } from '../middlewares/validatorHandler.js';

// Schemas
import { phoneSchema } from '../schemas/phoneSchema.js';

// Controllers
import { createOnePhone } from '../controllers/phone/createOnePhone.js';
import { listAllPhones } from '../controllers/phone/listAllPhones.js';
import { listAllPhonesByUser } from '../controllers/phone/listAllPhonesByUser.js';
import { listOnePhone } from '../controllers/phone/listOnePhone.js';
import { updateOnePhone } from '../controllers/phone/updateOnePhone.js';
import { deleteOnePhone } from '../controllers/phone/deleteOnePhone.js';

export const phoneRouter = Router();

// ────
// POST /create  →  Create a new phone
// Body: { authentication, newPhoneData: { phoneNumber } }
// Allowed: cliente, anunciante
// ────
phoneRouter.post(
  '/create',
  authAppVerifyToken,
  checkRole(['cliente', 'anunciante']),
  validatorHandler(phoneSchema.newPhoneData, 'body'),
  createOnePhone
);

// ────
// GET /list-all  →  List every phone in the system
// Body: { authentication }
// Allowed: administrador (only admin can list all)
// ────
phoneRouter.get(
  '/list-all',
  authAppVerifyToken,
  checkRole(['administrador']),
  listAllPhones
);

// ────
// GET /list-all-by-user/:id  →  List every phone related to a specific user
// Body: { authentication, userId }
// Allowed: cliente, anunciante (list their phones)
// Note: the controller expects userId in the body.
// ────
phoneRouter.get(
  '/list-all-by-user/:id',
  authAppVerifyToken,
  checkRole(['cliente', 'anunciante']),
  listAllPhonesByUser
);

// ────
// GET /list-one/:id  →  Retrieve a single phone by ID
// Body: { authentication, id }
// Allowed: administrador (only admin can list one)
// ────
phoneRouter.get(
  '/list-one/:id',
  authAppVerifyToken,
  checkRole(['administrador']),
  validatorHandler(phoneSchema.getPhoneById, 'body'),
  listOnePhone
);

// ────
// PATCH /update/:id  →  Update an existing phone by ID
// Body: { authentication, id, newPhoneData: { phoneNumber? } }
// Allowed: cliente, anunciante
// ────
phoneRouter.patch(
  '/update/:id',
  authAppVerifyToken,
  checkRole(['cliente', 'anunciante']),
  validatorHandler(phoneSchema.updatePhoneData, 'body'),
  updateOnePhone
);

// ────
// DELETE /delete/:id  →  Delete a phone by ID
// Body: { authentication, id }
// Allowed: cliente, anunciante
// ────
phoneRouter.delete(
  '/delete/:id',
  authAppVerifyToken,
  checkRole(['cliente', 'anunciante']),
  validatorHandler(phoneSchema.deletePhone, 'body'),
  deleteOnePhone
);

export default phoneRouter;