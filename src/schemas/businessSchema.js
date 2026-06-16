// ─────────────────────────────────────────────────────────────────────────────
// BUSINESS SCHEMA — Joi Validation
// Entity: Business | Table: negocio
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  name,
  description,
  facebook,
  instagram,
  tiktok,
  website,
} from '../utils/regEx/businessRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiOwnerUserId = Joi.number().integer().positive().messages({
  'number.base':     'El ownerUserId debe ser un número.',
  'number.integer':  'El ownerUserId debe ser un número entero.',
  'number.positive': 'El ownerUserId debe ser un número positivo.',
});

const joiLocationId = Joi.number().integer().positive().messages({
  'number.base':     'El locationId debe ser un número.',
  'number.integer':  'El locationId debe ser un número entero.',
  'number.positive': 'El locationId debe ser un número positivo.',
});

const joiName = Joi.string().pattern(name).messages({
  'string.pattern.base': 'El nombre del negocio debe tener entre 2 y 150 caracteres.',
});

const joiDescription = Joi.string().pattern(description).messages({
  'string.pattern.base': 'La descripción del negocio debe tener al menos 10 caracteres.',
});

const joiFacebook = Joi.string().pattern(facebook).messages({
  'string.pattern.base': 'La URL o usuario de Facebook no es válida.',
});

const joiInstagram = Joi.string().pattern(instagram).messages({
  'string.pattern.base': 'La URL o usuario de Instagram no es válida.',
});

const joiTiktok = Joi.string().pattern(tiktok).messages({
  'string.pattern.base': 'La URL o usuario de TikTok no es válida.',
});

const joiWebsite = Joi.string().pattern(website).messages({
  'string.pattern.base': 'La URL del sitio web debe comenzar con http:// o https:// y ser válida.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const businessSchema = {

  // GET /businesses/:id
  getBusinessById: Joi.object({
    id: joiId.required(),
  }),

  // POST /businesses
  newBusinessData: Joi.object({
    ownerUserId: joiOwnerUserId.required(),
    name:        joiName.required(),
    locationId:  joiLocationId.optional(),
    description: joiDescription.optional(),
    facebook:    joiFacebook.optional(),
    instagram:   joiInstagram.optional(),
    tiktok:      joiTiktok.optional(),
    website:     joiWebsite.optional(),
  }),

  // PATCH /businesses/:id
  updateBusinessData: Joi.object({
    name:        joiName.optional(),
    locationId:  joiLocationId.optional(),
    description: joiDescription.optional(),
    facebook:    joiFacebook.optional(),
    instagram:   joiInstagram.optional(),
    tiktok:      joiTiktok.optional(),
    website:     joiWebsite.optional(),
  }),

  // DELETE /businesses/:id
  deleteBusiness: Joi.object({
    id: joiId.required(),
  }),

};