// ─────────────────────────────────────────────────────────────────────────────
// ROLE SCHEMA — Joi Validation
// Entity: Role | Table: rol
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  name,
  description,
} from '../utils/regEx/roleRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiName = Joi.string().pattern(name).messages({
  'string.pattern.base': 'El nombre del rol debe tener entre 2 y 50 caracteres (letras, espacios, guiones bajos).',
});

const joiDescription = Joi.string().pattern(description).messages({
  'string.pattern.base': 'La descripción del rol debe tener entre 5 y 255 caracteres.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const roleSchema = {

  // GET /roles/:id
  getRoleById: Joi.object({
    id: joiId.required(),
  }),

  // POST /roles
  newRoleData: Joi.object({
    name:        joiName.required(),
    description: joiDescription.optional(),
  }),

  // PATCH /roles/:id
  updateRoleData: Joi.object({
    name:        joiName.optional(),
    description: joiDescription.optional(),
  }),

  // DELETE /roles/:id
  deleteRole: Joi.object({
    id: joiId.required(),
  }),

};