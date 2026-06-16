// ─────────────────────────────────────────────────────────────────────────────
// RESERVATION STATUS SCHEMA — Joi Validation
// Entity: ReservationStatus | Table: estado_reserva
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  name,
  description,
} from '../utils/regEx/reservationStatusRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiName = Joi.string().pattern(name).messages({
  'string.pattern.base': 'El nombre del estado de reserva debe tener entre 2 y 50 caracteres.',
});

const joiDescription = Joi.string().pattern(description).messages({
  'string.pattern.base': 'La descripción debe tener entre 5 y 255 caracteres.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const reservationStatusSchema = {

  // GET /reservation-statuses/:id
  getReservationStatusById: Joi.object({
    id: joiId.required(),
  }),

  // POST /reservation-statuses
  newReservationStatusData: Joi.object({
    name:        joiName.required(),
    description: joiDescription.optional(),
  }),

  // PATCH /reservation-statuses/:id
  updateReservationStatusData: Joi.object({
    name:        joiName.optional(),
    description: joiDescription.optional(),
  }),

  // DELETE /reservation-statuses/:id
  deleteReservationStatus: Joi.object({
    id: joiId.required(),
  }),

};