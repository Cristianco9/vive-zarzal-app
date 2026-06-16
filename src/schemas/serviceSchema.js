// ─────────────────────────────────────────────────────────────────────────────
// SERVICE SCHEMA — Joi Validation
// Entity: Service | Table: servicio
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  name,
  description,
  price,
  categoryId,
  statusId,
  ageRestrictionId,
  businessId,
} from '../utils/regEx/serviceRegEx.js';

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

const joiCategoryId = Joi.number().integer().positive().messages({
  'number.base':     'El categoryId debe ser un número.',
  'number.integer':  'El categoryId debe ser un número entero.',
  'number.positive': 'El categoryId debe ser un número positivo.',
});

const joiStatusId = Joi.number().integer().positive().messages({
  'number.base':     'El statusId debe ser un número.',
  'number.integer':  'El statusId debe ser un número entero.',
  'number.positive': 'El statusId debe ser un número positivo.',
});

const joiAgeRestrictionId = Joi.number().integer().positive().messages({
  'number.base':     'El ageRestrictionId debe ser un número.',
  'number.integer':  'El ageRestrictionId debe ser un número entero.',
  'number.positive': 'El ageRestrictionId debe ser un número positivo.',
});

const joiName = Joi.string().pattern(name).messages({
  'string.pattern.base': 'El nombre del servicio debe tener entre 2 y 200 caracteres.',
});

const joiDescription = Joi.string().pattern(description).messages({
  'string.pattern.base': 'La descripción del servicio debe tener al menos 10 caracteres.',
});

const joiPrice = Joi.string().pattern(price).messages({
  'string.pattern.base': 'El precio debe ser un número decimal válido (ej: 1500 o 29.99).',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const serviceSchema = {

  // GET /services/:id
  getServiceById: Joi.object({
    id: joiId.required(),
  }),

  // POST /services
  newServiceData: Joi.object({
    businessId:       joiBusinessId.required(),
    categoryId:       joiCategoryId.required(),
    statusId:         joiStatusId.required(),
    name:             joiName.required(),
    price:            joiPrice.required(),
    description:      joiDescription.optional(),
    ageRestrictionId: joiAgeRestrictionId.optional(),
  }),

  // PATCH /services/:id
  updateServiceData: Joi.object({
    categoryId:       joiCategoryId.optional(),
    statusId:         joiStatusId.optional(),
    name:             joiName.optional(),
    price:            joiPrice.optional(),
    description:      joiDescription.optional(),
    ageRestrictionId: joiAgeRestrictionId.optional(),
  }),

  // DELETE /services/:id
  deleteService: Joi.object({
    id: joiId.required(),
  }),

};