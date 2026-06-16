// ─────────────────────────────────────────────────────────────────────────────
// SERVICE REVIEW SCHEMA — Joi Validation
// Entity: ServiceReview | Table: resena_servicio
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  serviceId,
  userId,
  content,
  rating,
} from '../utils/regEx/serviceReviewRegEx.js';

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

const joiUserId = Joi.number().integer().positive().messages({
  'number.base':     'El userId debe ser un número.',
  'number.integer':  'El userId debe ser un número entero.',
  'number.positive': 'El userId debe ser un número positivo.',
});

const joiContent = Joi.string().pattern(content).messages({
  'string.pattern.base': 'El contenido de la reseña debe tener entre 10 y 5000 caracteres.',
});

const joiRating = Joi.string().pattern(rating).messages({
  'string.pattern.base': 'La puntuación debe ser un número entre 1 y 5.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const serviceReviewSchema = {

  // GET /service-reviews/:id
  getServiceReviewById: Joi.object({
    id: joiId.required(),
  }),

  // POST /service-reviews
  newServiceReviewData: Joi.object({
    serviceId: joiServiceId.required(),
    userId:    joiUserId.required(),
    rating:    joiRating.required(),
    content:   joiContent.optional(),
  }),

  // PATCH /service-reviews/:id
  updateServiceReviewData: Joi.object({
    rating:  joiRating.optional(),
    content: joiContent.optional(),
  }),

  // DELETE /service-reviews/:id
  deleteServiceReview: Joi.object({
    id: joiId.required(),
  }),

};