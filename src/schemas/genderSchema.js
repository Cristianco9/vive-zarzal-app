// ─────────────────────────────────────────────────────────────────────────────
// GENDER SCHEMA — Joi Validation
// Entity: Gender | Table: genero
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  name,
} from '../utils/regEx/genderRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiName = Joi.string().pattern(name).messages({
  'string.pattern.base': 'El tipo de género debe tener entre 2 y 50 caracteres (letras, espacios, guiones).',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const genderSchema = {

  // GET /genders/:id
  getGenderById: Joi.object({
    id: joiId.required(),
  }),

  // POST /genders
  newGenderData: Joi.object({
    name: joiName.required(),
  }),

  // PATCH /genders/:id
  updateGenderData: Joi.object({
    name: joiName.optional(),
  }),

  // DELETE /genders/:id
  deleteGender: Joi.object({
    id: joiId.required(),
  }),

};