// ─────────────────────────────────────────────────────────────────────────────
// DEPARTMENT SCHEMA — Joi Validation
// Entity: Department | Table: departamento
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  countryId,
  name,
  description,
} from '../utils/regEx/departamentRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiCountryId = Joi.number().integer().positive().messages({
  'number.base':     'El countryId debe ser un número.',
  'number.integer':  'El countryId debe ser un número entero.',
  'number.positive': 'El countryId debe ser un número positivo.',
});

const joiName = Joi.string().pattern(name).messages({
  'string.pattern.base': 'El nombre del departamento debe tener entre 2 y 100 caracteres.',
});

const joiDescription = Joi.string().pattern(description).messages({
  'string.pattern.base': 'La descripción debe tener entre 5 y 255 caracteres.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const departmentSchema = {

  // GET /departments/:id
  getDepartmentById: Joi.object({
    id: joiId.required(),
  }),

  // POST /departments
  newDepartmentData: Joi.object({
    countryId:   joiCountryId.required(),
    name:        joiName.required(),
    description: joiDescription.optional(),
  }),

  // PATCH /departments/:id
  updateDepartmentData: Joi.object({
    countryId:   joiCountryId.optional(),
    name:        joiName.optional(),
    description: joiDescription.optional(),
  }),

  // DELETE /departments/:id
  deleteDepartment: Joi.object({
    id: joiId.required(),
  }),

};