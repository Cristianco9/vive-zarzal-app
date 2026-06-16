// ─────────────────────────────────────────────────────────────────────────────
// SERVICE IMAGE SCHEMA — Joi Validation
// Entity: ServiceImage | Table: imagen_servicio
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  serviceId,
  imageUrl,
  description,
} from '../utils/regEx/serviceImageRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiServiceId = Joi.number().integer().positive().messages({
  'number.base':     'El serviceId debe ser un número.',
  'number.integer':  'El serviceId debe ser un número entero.',
  'number.positive': 'El serviceId debe ser un número positivo.',
});

const joiImageUrl = Joi.string().pattern(imageUrl).messages({
  'string.pattern.base': 'La URL de la imagen debe ser válida y terminar en una extensión de imagen.',
});

const joiDescription = Joi.string().pattern(description).messages({
  'string.pattern.base': 'La descripción (texto alternativo) debe tener entre 3 y 255 caracteres.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const serviceImageSchema = {

  // GET /service-images/:id
  getServiceImageById: Joi.object({
    id: joiId.required(),
  }),

  // POST /service-images
  newServiceImageData: Joi.object({
    serviceId:   joiServiceId.required(),
    imageUrl:    joiImageUrl.required(),
    description: joiDescription.optional(),
  }),

  // PATCH /service-images/:id
  updateServiceImageData: Joi.object({
    imageUrl:    joiImageUrl.optional(),
    description: joiDescription.optional(),
  }),

  // DELETE /service-images/:id
  deleteServiceImage: Joi.object({
    id: joiId.required(),
  }),

};