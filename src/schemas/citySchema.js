// ─────────────────────────────────────────────────────────────────────────────
// CITY SCHEMA — Joi Validation
// Entity: City | Table: ciudad
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  departmentId,
  name,
  description,
} from '../utils/regEx/cityRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiDepartmentId = Joi.number().integer().positive().messages({
  'number.base':     'El departmentId debe ser un número.',
  'number.integer':  'El departmentId debe ser un número entero.',
  'number.positive': 'El departmentId debe ser un número positivo.',
});

const joiName = Joi.string().pattern(name).messages({
  'string.pattern.base': 'El nombre de la ciudad debe tener entre 2 y 100 caracteres.',
});

const joiDescription = Joi.string().pattern(description).messages({
  'string.pattern.base': 'La descripción debe tener entre 5 y 255 caracteres.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const citySchema = {

  // GET /cities/:id
  getCityById: Joi.object({
    id: joiId.required(),
  }),

  // POST /cities
  newCityData: Joi.object({
    departmentId: joiDepartmentId.required(),
    name:         joiName.required(),
    description:  joiDescription.optional(),
  }),

  // PATCH /cities/:id
  updateCityData: Joi.object({
    departmentId: joiDepartmentId.optional(),
    name:         joiName.optional(),
    description:  joiDescription.optional(),
  }),

  // DELETE /cities/:id
  deleteCity: Joi.object({
    id: joiId.required(),
  }),

};