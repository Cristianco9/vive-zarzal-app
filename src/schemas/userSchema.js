// ─────────────────────────────────────────────────────────────────────────────
// USER SCHEMA — Joi Validation
// Entity: User | Table: usuario
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

// Import authentication RegEx
import { userAuthToken } from '../utils/regEx/authRegEx.js';

// Import user RegEx
import {
  ID,
  roleId,
  genderId,
  documentTypeId,
  firstName,
  lastName,
  birthDate,
  documentNumber,
  email,
  username,
  password,
} from '../utils/regEx/userRegEx.js';

// ── Primitive Joi types ───────────────────────────────────────────────────────

const joiAuthentication = Joi.string().pattern(userAuthToken).messages({
  'string.pattern.base': 'El token de autenticación no tiene un formato válido.',
});

const joiId = Joi.number().integer().positive().messages({
  'number.base':     'El ID debe ser un número.',
  'number.integer':  'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});

const joiRoleId = Joi.number().integer().positive().messages({
  'number.base':     'El roleId debe ser un número.',
  'number.integer':  'El roleId debe ser un número entero.',
  'number.positive': 'El roleId debe ser un número positivo.',
});

const joiGenderId = Joi.number().integer().positive().messages({
  'number.base':     'El genderId debe ser un número.',
  'number.integer':  'El genderId debe ser un número entero.',
  'number.positive': 'El genderId debe ser un número positivo.',
});

const joiDocumentTypeId = Joi.number().integer().positive().messages({
  'number.base':     'El documentTypeId debe ser un número.',
  'number.integer':  'El documentTypeId debe ser un número entero.',
  'number.positive': 'El documentTypeId debe ser un número positivo.',
});

const joiFirstName = Joi.string().pattern(firstName).messages({
  'string.pattern.base': 'El nombre debe contener solo letras y tener entre 2 y 100 caracteres.',
});

const joiLastName = Joi.string().pattern(lastName).messages({
  'string.pattern.base': 'El apellido debe contener solo letras y tener entre 2 y 100 caracteres.',
});

const joiBirthDate = Joi.string().pattern(birthDate).messages({
  'string.pattern.base': 'La fecha de nacimiento debe tener el formato YYYY-MM-DD.',
});

const joiDocumentNumber = Joi.string().pattern(documentNumber).messages({
  'string.pattern.base': 'El número de documento debe tener entre 5 y 30 caracteres alfanuméricos.',
});

const joiEmail = Joi.string().pattern(email).messages({
  'string.pattern.base': 'El correo electrónico no tiene un formato válido.',
});

const joiUsername = Joi.string().pattern(username).messages({
  'string.pattern.base': 'El nombre de usuario debe tener entre 3 y 80 caracteres (letras, dígitos, . - _).',
});

const joiPassword = Joi.string().pattern(password).messages({
  'string.pattern.base': 'La contraseña debe tener entre 8 y 30 caracteres, con al menos una letra y un dígito.',
});

// ── Schema export ─────────────────────────────────────────────────────────────

export const userSchema = {

  // GET /users/:id — validate route param
  getUserById: Joi.object({
    id: joiId.required(),
  }),

  // POST /users — create a new user
  newUserData: Joi.object({
    roleId:         joiRoleId.required(),
    firstName:      joiFirstName.required(),
    lastName:       joiLastName.required(),
    email:          joiEmail.required(),
    username:       joiUsername.required(),
    password:       joiPassword.required(),
    genderId:       joiGenderId.optional(),
    documentTypeId: joiDocumentTypeId.optional(),
    documentNumber: joiDocumentNumber.optional(),
    birthDate:      joiBirthDate.optional(),
  }),

  // PATCH /users/:id — update an existing user (all fields optional)
  updateUserData: Joi.object({
    roleId:         joiRoleId.optional(),
    firstName:      joiFirstName.optional(),
    lastName:       joiLastName.optional(),
    email:          joiEmail.optional(),
    username:       joiUsername.optional(),
    password:       joiPassword.optional(),
    genderId:       joiGenderId.optional(),
    documentTypeId: joiDocumentTypeId.optional(),
    documentNumber: joiDocumentNumber.optional(),
    birthDate:      joiBirthDate.optional(),
  }),

  // DELETE /users/:id — validate route param
  deleteUser: Joi.object({
    id: joiId.required(),
  }),

  // POST /auth/login — login body
  loginData: Joi.object({
    username:       joiUsername.required(),
    password:       joiPassword.required(),
  }),

};