// ─────────────────────────────────────────────────────────────────────────────
// RESERVATION SCHEMA — Joi Validation
// Entity: Reservation | Table: reserva
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  serviceId,
} from '../utils/regEx/reservationRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base': 'El ID debe ser un número.',
  'number.integer': 'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiServiceId = Joi.number().integer().positive().messages({
  'number.base': 'El serviceId debe ser un número.',
  'number.integer': 'El serviceId debe ser un número entero.',
  'number.positive': 'El serviceId debe ser un número positivo.',
});

const joiQuantity = Joi.number().integer().positive().messages({
  'number.base': 'La cantidad debe ser un número.',
  'number.integer': 'La cantidad debe ser un número entero.',
  'number.positive': 'La cantidad debe ser un número positivo.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const reservationSchema = {

  // GET /reservations/:id
  getReservationById: Joi.object({
    id: joiId.required(),
  }),

  // POST /reservations — client creates a reservation for a service
  newReservationData: Joi.object({
    serviceId: joiServiceId.required(),
  }),

  // DELETE /reservations/:id
  deleteReservation: Joi.object({
    id: joiId.required(),
  }),

  newReservationData: Joi.object({
    serviceId: joiServiceId.required(),
    quantity: joiQuantity.required(),
  }),

};