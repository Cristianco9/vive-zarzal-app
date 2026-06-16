// ─────────────────────────────────────────────────────────────────────────────
// RESERVATION DETAIL SCHEMA — Joi Validation
// Entity: ReservationDetail | Table: reserva_detalle
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  reservationId,
  userId,
  quantity,
  reservationStatusId,
} from '../utils/regEx/reservationDetailsRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiReservationId = Joi.number().integer().positive().messages({
  'number.base':     'El reservationId debe ser un número.',
  'number.integer':  'El reservationId debe ser un número entero.',
  'number.positive': 'El reservationId debe ser un número positivo.',
});

const joiUserId = Joi.number().integer().positive().messages({
  'number.base':     'El userId debe ser un número.',
  'number.integer':  'El userId debe ser un número entero.',
  'number.positive': 'El userId debe ser un número positivo.',
});

const joiReservationStatusId = Joi.number().integer().positive().messages({
  'number.base':     'El reservationStatusId debe ser un número.',
  'number.integer':  'El reservationStatusId debe ser un número entero.',
  'number.positive': 'El reservationStatusId debe ser un número positivo.',
});

const joiQuantity = Joi.string().pattern(quantity).messages({
  'string.pattern.base': 'La cantidad debe ser un número entero entre 1 y 9999.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const reservationDetailsSchema = {

  // GET /reservation-details/:id
  getReservationDetailById: Joi.object({
    id: joiId.required(),
  }),

  // POST /reservation-details
  newReservationDetailData: Joi.object({
    reservationId:       joiReservationId.required(),
    userId:              joiUserId.required(),
    reservationStatusId: joiReservationStatusId.required(),
    quantity:            joiQuantity.required(),
  }),

  // PATCH /reservation-details/:id — anunciante acepta/cancela
  updateReservationDetailData: Joi.object({
    reservationStatusId: joiReservationStatusId.optional(),
    quantity:            joiQuantity.optional(),
  }),

  // DELETE /reservation-details/:id
  deleteReservationDetail: Joi.object({
    id: joiId.required(),
  }),

};