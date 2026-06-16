// ─────────────────────────────────────────────────────────────────────────────
// FAVORITE USER SERVICE SCHEMA — Joi Validation
// Entity: ServiceFavorite | Table: servicio_favoritos_usuarios
// Junction table: User ↔ Service (favorites)
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  userId,
  serviceId,
} from '../utils/regEx/favoriteUserServiceRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiUserId = Joi.number().integer().positive().messages({
  'number.base':     'El userId debe ser un número.',
  'number.integer':  'El userId debe ser un número entero.',
  'number.positive': 'El userId debe ser un número positivo.',
});

const joiServiceId = Joi.number().integer().positive().messages({
  'number.base':     'El serviceId debe ser un número.',
  'number.integer':  'El serviceId debe ser un número entero.',
  'number.positive': 'El serviceId debe ser un número positivo.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const favoriteUserServiceSchema = {

  // GET /favorites/:id
  getFavoriteById: Joi.object({
    id: joiId.required(),
  }),

  // GET /favorites/by-user/:id
  getFavoritesByUserId: Joi.object({
  userId: joiUserId.required(),
  }),

  // POST /favorites — add a service to user's favorites
  newFavoriteData: Joi.object({
    userId:    joiUserId.required(),
    serviceId: joiServiceId.required(),
  }),

  // DELETE /favorites/:id — remove from favorites
  deleteFavorite: Joi.object({
    id: joiId.required(),
  }),
};