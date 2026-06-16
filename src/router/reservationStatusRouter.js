// ────────────────────────────────────────────────────────────────────────────
// RESERVATION STATUS ROUTER
// Entity: ReservationStatus | Table: estado_reserva
//
// Defines and exposes the HTTP endpoints used to manage the "reservation
// status" catalog. This is an administrative catalog: only users whose JWT
// carries the 'administrador' role are allowed to create, update, or delete
// records. Every role can read it (list-all / list-one), since reservation
// statuses are referenced across the application (e.g. to display a
// reservation's current state to clients and advertisers).
//
// Security pipeline applied to each route (in order):
//   1. authAppVerifyToken → validates the session JWT and refreshes it.
//   2. checkRole([...]) → authorizes only the allowed roles for the action.
//   3. validatorHandler(schema, 'body') → validates the incoming payload (Joi).
//   4. controller → executes the business operation and builds the response.
//
// Mounted at: /app/v1/reservation-statuses  (see src/router/index.js)
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

// Joi schema collection for the reservation status entity
import { reservationStatusSchema } from '../schemas/reservationStatusSchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

// Controller to create a single reservation status
import { createOneReservationStatus } from
  '../controllers/reservationStatus/createOneReservationStatus.js';
// Controller to retrieve every reservation status
import { listAllReservationStatuses } from
  '../controllers/reservationStatus/listAllReservationStatuses.js';
// Controller to retrieve a single reservation status by its ID
import { listOneReservationStatus } from
  '../controllers/reservationStatus/listOneReservationStatus.js';
// Controller to update a single reservation status by its ID
import { updateOneReservationStatus } from
  '../controllers/reservationStatus/updateOneReservationStatus.js';
// Controller to delete a single reservation status by its ID
import { deleteOneReservationStatus } from
  '../controllers/reservationStatus/deleteOneReservationStatus.js';

// Create a new Router instance dedicated to the reservation status resource
export const reservationStatusRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Create a new reservation status
// Body: { authentication, newReservationStatusData: { name, description? } }
// ─────────────────────────────────────────────────────────────────────────────
reservationStatusRouter.post(
  '/create',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the creation payload
  validatorHandler(reservationStatusSchema.newReservationStatusData, 'body'),
  // Step 4: delegate to the controller
  createOneReservationStatus
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List all reservation statuses
// Body: { authentication }
// ─────────────────────────────────────────────────────────────────────────────
reservationStatusRouter.get(
  '/list-all',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: delegate to the controller (no payload to validate)
  listAllReservationStatuses
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one/:id  →  Retrieve a single reservation status by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
reservationStatusRouter.get(
  '/list-one/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize all the roles
  checkRole(['administrador', 'cliente', 'anunciante']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(reservationStatusSchema.getReservationStatusById, 'body'),
  // Step 4: delegate to the controller
  listOneReservationStatus
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /update/:id  →  Update an existing reservation status by ID
// Body: { authentication, id, newReservationStatusData: { name?, description? } }
// ─────────────────────────────────────────────────────────────────────────────
reservationStatusRouter.patch(
  '/update/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate the update payload
  validatorHandler(reservationStatusSchema.updateReservationStatusData, 'body'),
  // Step 4: delegate to the controller
  updateOneReservationStatus
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete/:id  →  Delete a reservation status by ID
// Body: { authentication, id }
// ─────────────────────────────────────────────────────────────────────────────
reservationStatusRouter.delete(
  '/delete/:id',
  // Step 1: verify the session token
  authAppVerifyToken,
  // Step 2: authorize only the administrator role
  checkRole(['administrador']),
  // Step 3: validate that a valid ID was provided
  validatorHandler(reservationStatusSchema.deleteReservationStatus, 'body'),
  // Step 4: delegate to the controller
  deleteOneReservationStatus
);

// Export the configured router for registration in the main router (index.js)
export default reservationStatusRouter;