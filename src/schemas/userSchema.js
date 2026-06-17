// src/schemas/userSchema.js
import Joi from 'joi';

// Import your regex constants (ajusta las rutas si es necesario)
import { userAuthToken } from '../utils/regEx/authRegEx.js';
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
import {
  name,
  description,
  facebook,
  instagram,
  tiktok,
  website,
} from '../utils/regEx/businessRegEx.js';

// Primitive Joi types and messages (como antes)
const joiId = Joi.number().integer().positive().messages({
  'number.base': 'El ID debe ser un número.',
  'number.integer': 'El ID debe ser un número entero.',
  'number.positive': 'El ID debe ser un número positivo.',
});
const joiRoleId = Joi.number().integer().positive().messages({
  'number.base': 'El roleId debe ser un número.',
  'number.integer': 'El roleId debe ser un número entero.',
  'number.positive': 'El roleId debe ser un número positivo.',
});
const joiGenderId = Joi.number().integer().positive().messages({
  'number.base': 'El genderId debe ser un número.',
  'number.integer': 'El genderId debe ser un número entero.',
  'number.positive': 'El genderId debe ser un número positivo.',
});
const joiDocumentTypeId = Joi.number().integer().positive().messages({
  'number.base': 'El documentTypeId debe ser un número.',
  'number.integer': 'El documentTypeId debe ser un número entero.',
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

// --- Reusable sub-schemas ---
// 1) esquema plano del usuario (permitimos claves extra para tolerancia del frontend)
export const flatNewUserDataSchema = Joi.object({
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
}).unknown(true); // <-- allow extra keys like passwordConfirm, dob, phone, etc.

// 2) esquema de business (para el wrapper)
export const businessSchema = Joi.object({
  name:        joiName.required(),
  locationId:  Joi.number().integer().positive().optional(),
  description: joiDescription.optional(),
  facebook:    joiFacebook.optional(),
  instagram:   joiInstagram.optional(),
  tiktok:      joiTiktok.optional(),
  website:     joiWebsite.optional(),
}).unknown(true); // <-- permitir claves extra si frontend envía otras

// 3) esquema envuelto para anunciantes: { newUserData: {...}, business: {...} }
export const advertiserWrappedSchema = Joi.object({
  newUserData: flatNewUserDataSchema.required(),
  business: businessSchema.required(),
}).unknown(true);

// --- Export principal (los endpoints usan estas referencias) ---
export const userSchema = {
  getUserById: Joi.object({ id: joiId.required() }),

  // POST /users — soporta formulario plano o wrapper anunciante
  newUserData: Joi.alternatives().try(
    flatNewUserDataSchema,
    advertiserWrappedSchema
  ).required(),

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
  }).unknown(true),

  deleteUser: Joi.object({ id: joiId.required() }),

  loginData: Joi.object({
    username: joiUsername.required(),
    password: joiPassword.required(),
  }).unknown(true),
};

export default userSchema;