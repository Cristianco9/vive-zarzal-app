// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE SCHEMA — Joi Validation
// Entity: Message | Table: mensaje
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  ID,
  content,
  statusId,
  senderUserId,
  receiverUserId,
} from '../utils/regEx/messageRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});
 
const joiSenderUserId = Joi.number().integer().positive().messages({
  'number.base':     'El senderUserId debe ser un número.',
  'number.integer':  'El senderUserId debe ser un número entero.',
  'number.positive': 'El senderUserId debe ser un número positivo.',
});
 
const joiReceiverUserId = Joi.number().integer().positive().messages({
  'number.base':     'El receiverUserId debe ser un número.',
  'number.integer':  'El receiverUserId debe ser un número entero.',
  'number.positive': 'El receiverUserId debe ser un número positivo.',
});
 
const joiStatusId = Joi.number().integer().positive().messages({
  'number.base':     'El statusId debe ser un número.',
  'number.integer':  'El statusId debe ser un número entero.',
  'number.positive': 'El statusId debe ser un número positivo.',
});
 
const joiContent = Joi.string().pattern(content).messages({
  'string.pattern.base': 'El contenido del mensaje debe tener entre 1 y 10,000 caracteres.',
});

// Reuses the same positive-integer rule as the other participant ids;
// kept as separate constants so each field gets its own error label.
const joiUserAId = Joi.number().integer().positive().messages({
  'number.base':     'El userAId debe ser un número.',
  'number.integer':  'El userAId debe ser un número entero.',
  'number.positive': 'El userAId debe ser un número positivo.',
});
 
const joiUserBId = Joi.number().integer().positive().messages({
  'number.base':     'El userBId debe ser un número.',
  'number.integer':  'El userBId debe ser un número entero.',
  'number.positive': 'El userBId debe ser un número positivo.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const messageSchema = {

  // GET /messages/:id
  getMessageById: Joi.object({
    id: joiId.required(),
  }),

  // POST /messages — send a message
  newMessageData: Joi.object({
    senderUserId:   joiSenderUserId.required(),
    receiverUserId: joiReceiverUserId.required(),
    statusId:       joiStatusId.required(),
    content:        joiContent.required(),
  }),

  // PATCH /messages/:id — update status (e.g. mark as read)
  updateMessageData: Joi.object({
    statusId: joiStatusId.optional(),
    content:  joiContent.optional(),
  }),

  // DELETE /messages/:id
  deleteMessage: Joi.object({
    id: joiId.required(),
  }),

  // GET /messages/list-conversation — the two participants of the conversation
  getConversationMessages: Joi.object({
    userAId: joiUserAId.required(),
    userBId: joiUserBId.required(),
  }),

};