// ─────────────────────────────────────────────────────────────────────────────
// AGE RESTRICTION SCHEMA — Joi Validation
// Entity: AgeRestriction | Table: restriccion_edad
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  name,
  description,
} from '../utils/regEx/ageRestrictionRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiName = Joi.string().pattern(name).messages({
  'string.pattern.base': 'El nombre de la restricción de edad debe tener entre 3 y 100 caracteres (solo letras y espacios).',
});

const joiDescription = Joi.string().pattern(description).messages({
  'string.pattern.base': 'La descripción debe tener entre 5 y 255 caracteres.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const ageRestrictionSchema = {

  // GET /age-restrictions/:id
  getAgeRestrictionById: Joi.object({
    id: joiId.required(),
  }),

  // POST /age-restrictions
  newAgeRestrictionData: Joi.object({
    name:        joiName.required(),
    description: joiDescription.optional(),
  }),

  // PATCH /age-restrictions/:id
  updateAgeRestrictionData: Joi.object({
    name:        joiName.optional(),
    description: joiDescription.optional(),
  }),

  // DELETE /age-restrictions/:id
  deleteAgeRestriction: Joi.object({
    id: joiId.required(),
  }),

};