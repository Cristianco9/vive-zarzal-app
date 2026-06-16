// ─────────────────────────────────────────────────────────────────────────────
// USER PHONE SCHEMA — Joi Validation
// Entity: UserPhone | Table: usuario_telefono
// Junction table: User ↔ Phone
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  userId,
  phoneId,
} from '../utils/regEx/userPhoneRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiUserId = Joi.number().integer().positive().messages({
  'number.base':     'El userId debe ser un número.',
  'number.integer':  'El userId debe ser un número entero.',
  'number.positive': 'El userId debe ser un número positivo.',
});

const joiPhoneId = Joi.number().integer().positive().messages({
  'number.base':     'El phoneId debe ser un número.',
  'number.integer':  'El phoneId debe ser un número entero.',
  'number.positive': 'El phoneId debe ser un número positivo.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const userPhoneSchema = {

  // GET /user-phones/:id
  getUserPhoneById: Joi.object({
    id: joiId.required(),
  }),

  // POST /user-phones — assign a phone to a user
  newUserPhoneData: Joi.object({
    userId:  joiUserId.required(),
    phoneId: joiPhoneId.required(),
  }),

  // DELETE /user-phones/:id
  deleteUserPhone: Joi.object({
    id: joiId.required(),
  }),

};