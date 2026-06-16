// ─────────────────────────────────────────────────────────────────────────────
// BUSINESS REVIEW SCHEMA — Joi Validation
// Entity: BusinessReview | Table: resena_negocio
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  businessId,
  userId,
  content,
  rating,
} from '../utils/regEx/businessReviewRegEx.js';

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

export const businessReviewSchema = {

  // GET /business-reviews/:id
  getBusinessReviewById: Joi.object({
    id: joiId.required(),
  }),

  // POST /business-reviews
  newBusinessReviewData: Joi.object({
    businessId: joiBusinessId.required(),
    userId:     joiUserId.required(),
    rating:     joiRating.required(),
    content:    joiContent.optional(),
  }),

  // PATCH /business-reviews/:id
  updateBusinessReviewData: Joi.object({
    rating:  joiRating.optional(),
    content: joiContent.optional(),
  }),

  // DELETE /business-reviews/:id
  deleteBusinessReview: Joi.object({
    id: joiId.required(),
  }),

};