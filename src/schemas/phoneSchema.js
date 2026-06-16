// ─────────────────────────────────────────────────────────────────────────────
// PHONE SCHEMA — Joi Validation
// Entity: Phone | Table: telefono
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  phoneNumber,
} from '../utils/regEx/phoneRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiPhoneNumber = Joi.string().pattern(phoneNumber).messages({
  'string.pattern.base': 'El número de teléfono debe tener entre 7 y 20 caracteres en formato válido.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const phoneSchema = {

  // GET /phones/:id
  getPhoneById: Joi.object({
    id: joiId.required(),
  }),

  // POST /phones
  newPhoneData: Joi.object({
    phoneNumber: joiPhoneNumber.required(),
  }),

  // PATCH /phones/:id
  updatePhoneData: Joi.object({
    phoneNumber: joiPhoneNumber.optional(),
  }),

  // DELETE /phones/:id
  deletePhone: Joi.object({
    id: joiId.required(),
  }),

};