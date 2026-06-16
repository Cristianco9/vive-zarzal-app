// ─────────────────────────────────────────────────────────────────────────────
// BUSINESS PHONE SCHEMA — Joi Validation
// Entity: BusinessPhone | Table: negocio_telefono
// Junction table: Business ↔ Phone
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  businessId,
  phoneId,
} from '../utils/regEx/businessPhoneRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiBusinessId = Joi.number().integer().positive().messages({
  'number.base':     'El businessId debe ser un número.',
  'number.integer':  'El businessId debe ser un número entero.',
  'number.positive': 'El businessId debe ser un número positivo.',
});

const joiPhoneId = Joi.number().integer().positive().messages({
  'number.base':     'El phoneId debe ser un número.',
  'number.integer':  'El phoneId debe ser un número entero.',
  'number.positive': 'El phoneId debe ser un número positivo.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const businessPhoneSchema = {

  // GET /business-phones/:id
  getBusinessPhoneById: Joi.object({
    id: joiId.required(),
  }),

  // POST /business-phones — assign a phone to a business
  newBusinessPhoneData: Joi.object({
    businessId: joiBusinessId.required(),
    phoneId:    joiPhoneId.required(),
  }),

  // DELETE /business-phones/:id
  deleteBusinessPhone: Joi.object({
    id: joiId.required(),
  }),

};