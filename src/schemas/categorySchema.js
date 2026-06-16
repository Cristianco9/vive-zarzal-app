// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY SCHEMA — Joi Validation
// Entity: Category | Table: categoria
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  name,
  description,
} from '../utils/regEx/categoryRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiName = Joi.string().pattern(name).messages({
  'string.pattern.base': 'El nombre de la categoría debe tener entre 2 y 100 caracteres.',
});

const joiDescription = Joi.string().pattern(description).messages({
  'string.pattern.base': 'La descripción de la categoría debe tener al menos 5 caracteres.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const categorySchema = {

  // GET /categories/:id
  getCategoryById: Joi.object({
    id: joiId.required(),
  }),

  // POST /categories
  newCategoryData: Joi.object({
    name:        joiName.required(),
    description: joiDescription.optional(),
  }),

  // PATCH /categories/:id
  updateCategoryData: Joi.object({
    name:        joiName.optional(),
    description: joiDescription.optional(),
  }),

  // DELETE /categories/:id
  deleteCategory: Joi.object({
    id: joiId.required(),
  }),

};