// ─────────────────────────────────────────────────────────────────────────────
// COUNTRY SCHEMA — Joi Validation
// Entity: Country | Table: pais
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  name,
  description,
} from '../utils/regEx/countryRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiName = Joi.string().pattern(name).messages({
  'string.pattern.base': 'El nombre del país debe tener entre 2 y 100 caracteres (letras, espacios, guiones, puntos).',
});

const joiDescription = Joi.string().pattern(description).messages({
  'string.pattern.base': 'La descripción debe tener entre 5 y 255 caracteres.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const countrySchema = {

  // GET /countries/:id
  getCountryById: Joi.object({
    id: joiId.required(),
  }),

  // POST /countries
  newCountryData: Joi.object({
    name:        joiName.required(),
    description: joiDescription.optional(),
  }),

  // PATCH /countries/:id
  updateCountryData: Joi.object({
    name:        joiName.optional(),
    description: joiDescription.optional(),
  }),

  // DELETE /countries/:id
  deleteCountry: Joi.object({
    id: joiId.required(),
  }),

};