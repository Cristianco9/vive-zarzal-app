// ────────────────────────────────────────────────────────────────────────────
// RESERVATIONS ROUTER
// Entity: Reservation | Table: reserva
//
// Defines and exposes the HTTP endpoints used to manage reservations.
// Each route is protected by JWT authentication and role authorization.
//
// Security pipeline applied to each route (in order):
//   1. authAppVerifyToken  → validates the session JWT and refreshes it.
//   2. checkRole([...])    → authorizes only the allowed roles for the action.
//   3. validatorHandler(schema, source) → validates the payload (Joi).
//   4. controller          → executes the business operation and returns the response.
//
// NOTE: reservationSchema.newReservationData must be updated to include
//       `quantity` (currently only validates `serviceId`).
//
// Mounted at: /app/v1/reservations  (see src/router/index.js)
// ────────────────────────────────────────────────────────────────────────────

import { Router } from 'express';

// Middlewares
import { authAppVerifyToken } from '../middlewares/tokenHandlers/authAppTokenHandler.js';
import { checkRole } from '../middlewares/checkRoleHandler.js';
import { validatorHandler } from '../middlewares/validatorHandler.js';

// Schemas
import { reservationSchema } from '../schemas/reservationSchema.js';

// Controllers
import { createOneReservation }        from '../controllers/reservation/createOneReservation.js';
import { deleteOneReservation }        from '../controllers/reservation/deleteOneReservation.js';
import { listAllReservations }         from '../controllers/reservation/listAllReservations.js';
import { listReservationsByBusiness }  from '../controllers/reservation/listReservationsByBusiness.js';
import { listOneReservation }          from '../controllers/reservation/listOneReservation.js';
import { listReservationsByService }   from '../controllers/reservation/listReservationsByService.js';
import { listUserReservations }        from '../controllers/reservation/listUserReservations.js';
import { updateOneReservation }        from '../controllers/reservation/updateOneReservation.js';

export const reservationsRouter = Router();

// ────
// POST /create  →  Create a new reservation
// Body: { serviceId, quantity }
// Allowed: cliente
// ────
reservationsRouter.post(
  '/create',
  authAppVerifyToken,
  checkRole(['cliente']),
  validatorHandler(reservationSchema.newReservationData, 'body'),
  createOneReservation
);

// ────
// DELETE /delete/:id  →  Delete a reservation by ID
// Params: { id }
// Allowed: administrador, cliente (service layer enforces ownership for cliente)
// ────
reservationsRouter.delete(
  '/delete/:id',
  authAppVerifyToken,
  checkRole(['administrador', 'cliente']),
  validatorHandler(reservationSchema.deleteReservation, 'params'),
  deleteOneReservation
);

// ────
// GET /list-all  →  List every reservation in the system
// Allowed: administrador
// ────
reservationsRouter.get(
  '/list-all',
  authAppVerifyToken,
  checkRole(['administrador']),
  listAllReservations
);

// ────
// GET /list-by-business/:businessId  →  List all reservations of a business
// Params: { businessId }
// Allowed: administrador, anunciante (service layer enforces ownership for anunciante)
// ────
reservationsRouter.get(
  '/list-by-business/:businessId',
  authAppVerifyToken,
  checkRole(['administrador', 'anunciante']),
  listReservationsByBusiness
);

// ────
// GET /list-one/:id  →  Retrieve a single reservation by ID
// Params: { id }
// Allowed: administrador, anunciante, cliente
// ────
reservationsRouter.get(
  '/list-one/:id',
  authAppVerifyToken,
  checkRole(['administrador', 'anunciante', 'cliente']),
  validatorHandler(reservationSchema.getReservationById, 'params'),
  listOneReservation
);

// ────
// GET /list-by-service/:serviceId  →  List all reservations of a service
// Params: { serviceId }
// Allowed: administrador, anunciante
// ────
reservationsRouter.get(
  '/list-by-service/:serviceId',
  authAppVerifyToken,
  checkRole(['administrador', 'anunciante']),
  listReservationsByService
);

// ────
// GET /list-by-user  →  List all reservations of the authenticated user
// Allowed: administrador, cliente
// ────
reservationsRouter.get(
  '/list-by-user',
  authAppVerifyToken,
  checkRole(['administrador', 'cliente']),
  listUserReservations
);

// ────
// PATCH /update/:id  →  Update an existing reservation by ID
// Params: { id } | Body: { serviceId? }
// Allowed: administrador, anunciante, cliente (service layer enforces ownership)
// ────
reservationsRouter.patch(
  '/update/:id',
  authAppVerifyToken,
  checkRole(['administrador', 'anunciante', 'cliente']),
  updateOneReservation
);

export default reservationsRouter;