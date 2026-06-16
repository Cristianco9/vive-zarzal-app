// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT TYPE SCHEMA — Joi Validation
// Entity: DocumentType | Table: tipo_documento
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  name,
} from '../utils/regEx/documentTypeRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiName = Joi.string().pattern(name).messages({
  'string.pattern.base': 'El nombre del tipo de documento debe tener entre 2 y 100 caracteres.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const documentTypeSchema = {

  // GET /document-types/:id
  getDocumentTypeById: Joi.object({
    id: joiId.required(),
  }),

  // POST /document-types
  newDocumentTypeData: Joi.object({
    name: joiName.required(),
  }),

  // PATCH /document-types/:id
  updateDocumentTypeData: Joi.object({
    name: joiName.optional(),
  }),

  // DELETE /document-types/:id
  deleteDocumentType: Joi.object({
    id: joiId.required(),
  }),

};