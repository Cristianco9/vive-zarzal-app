// ─────────────────────────────────────────────────────────────────────────────
// USER IMAGE SCHEMA — Joi Validation
// Entity: UserImage | Table: imagen_usuario
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  userId,
  url,
  name,
  altText,
} from '../utils/regEx/userImageRegEx.js';

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

const joiUrl = Joi.string().pattern(url).messages({
  'string.pattern.base': 'La URL de la imagen debe ser válida y terminar en una extensión de imagen (.jpg, .png, .webp, etc.).',
});

const joiName = Joi.string().pattern(name).messages({
  'string.pattern.base': 'El nombre de la imagen debe tener entre 2 y 255 caracteres.',
});

const joiAltText = Joi.string().pattern(altText).messages({
  'string.pattern.base': 'El texto alternativo debe tener entre 3 y 255 caracteres.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const userImageSchema = {

  // GET /user-images/:id
  getUserImageById: Joi.object({
    id: joiId.required(),
  }),

  // POST /user-images
  newUserImageData: Joi.object({
    userId:  joiUserId.required(),
    url:     joiUrl.required(),
    name:    joiName.optional(),
    altText: joiAltText.optional(),
  }),

  // PATCH /user-images/:id
  updateUserImageData: Joi.object({
    url:     joiUrl.optional(),
    name:    joiName.optional(),
    altText: joiAltText.optional(),
  }),

  // DELETE /user-images/:id
  deleteUserImage: Joi.object({
    id: joiId.required(),
  }),

};