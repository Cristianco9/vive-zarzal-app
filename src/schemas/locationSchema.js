// ─────────────────────────────────────────────────────────────────────────────
// LOCATION SCHEMA — Joi Validation
// Entity: Location | Table: ubicacion
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  cityId,
  name,
  description,
  code,
} from '../utils/regEx/locationRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiCityId = Joi.number().integer().positive().messages({
  'number.base':     'El cityId debe ser un número.',
  'number.integer':  'El cityId debe ser un número entero.',
  'number.positive': 'El cityId debe ser un número positivo.',
});

const joiName = Joi.string().pattern(name).messages({
  'string.pattern.base': 'El nombre de la ubicación debe tener entre 3 y 150 caracteres.',
});

const joiDescription = Joi.string().pattern(description).messages({
  'string.pattern.base': 'La descripción de la ubicación debe tener al menos 5 caracteres.',
});

const joiCode = Joi.string().pattern(code).messages({
  'string.pattern.base': 'El código de ubicación debe tener entre 2 y 50 caracteres alfanuméricos.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const locationSchema = {

  // GET /locations/:id
  getLocationById: Joi.object({
    id: joiId.required(),
  }),

  // POST /locations
  newLocationData: Joi.object({
    cityId:      joiCityId.required(),
    name:        joiName.required(),
    description: joiDescription.optional(),
    code:        joiCode.optional(),
  }),

  // PATCH /locations/:id
  updateLocationData: Joi.object({
    cityId:      joiCityId.optional(),
    name:        joiName.optional(),
    description: joiDescription.optional(),
    code:        joiCode.optional(),
  }),

  // DELETE /locations/:id
  deleteLocation: Joi.object({
    id: joiId.required(),
  }),

};