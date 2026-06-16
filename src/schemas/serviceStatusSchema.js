// ─────────────────────────────────────────────────────────────────────────────
// SERVICE STATUS SCHEMA — Joi Validation
// Entity: ServiceStatus | Table: estado_servicio
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  name,
  description,
} from '../utils/regEx/serviceStatusRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiName = Joi.string().pattern(name).messages({
  'string.pattern.base': 'El nombre del estado debe tener entre 2 y 50 caracteres.',
});

const joiDescription = Joi.string().pattern(description).messages({
  'string.pattern.base': 'La descripción debe tener entre 5 y 255 caracteres.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const serviceStatusSchema = {

  // GET /service-statuses/:id
  getServiceStatusById: Joi.object({
    id: joiId.required(),
  }),

  // POST /service-statuses
  newServiceStatusData: Joi.object({
    name:        joiName.required(),
    description: joiDescription.optional(),
  }),

  // PATCH /service-statuses/:id
  updateServiceStatusData: Joi.object({
    name:        joiName.optional(),
    description: joiDescription.optional(),
  }),

  // DELETE /service-statuses/:id
  deleteServiceStatus: Joi.object({
    id: joiId.required(),
  }),

};