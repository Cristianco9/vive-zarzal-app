// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE STATUS SCHEMA — Joi Validation
// Entity: MessageStatus | Table: estado_mensaje
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  name,
  description,
} from '../utils/regEx/messageStatusRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiName = Joi.string().pattern(name).messages({
  'string.pattern.base': 'El nombre del estado de mensaje debe tener entre 2 y 50 caracteres.',
});

const joiDescription = Joi.string().pattern(description).messages({
  'string.pattern.base': 'La descripción debe tener entre 5 y 255 caracteres.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const messageStatusSchema = {

  // GET /message-statuses/:id
  getMessageStatusById: Joi.object({
    id: joiId.required(),
  }),

  // POST /message-statuses
  newMessageStatusData: Joi.object({
    name:        joiName.required(),
    description: joiDescription.optional(),
  }),

  // PATCH /message-statuses/:id
  updateMessageStatusData: Joi.object({
    name:        joiName.optional(),
    description: joiDescription.optional(),
  }),

  // DELETE /message-statuses/:id
  deleteMessageStatus: Joi.object({
    id: joiId.required(),
  }),

};