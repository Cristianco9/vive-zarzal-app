import Joi from 'joi';

export const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(80).required(),
  lastName: Joi.string().trim().min(2).max(80).required(),
  username: Joi.string().trim().alphanum().min(3).max(50).required(),
  email: Joi.string().trim().email().max(150).required(),
  password: Joi.string().min(8).max(72).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Las contraseñas no coinciden',
  }),
});

export const loginSchema = Joi.object({
  identifier: Joi.string().trim().required(),
  password: Joi.string().required(),
});

export const profileSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(80).required(),
  lastName: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().trim().email().max(150).required(),
  bio: Joi.string().allow('').max(500).optional(),
});

export const publicationSchema = Joi.object({
  type: Joi.string().valid('dish', 'recipe').required(),
  title: Joi.string().trim().min(3).max(150).required(),
  description: Joi.string().trim().min(10).max(2000).required(),
  categoryId: Joi.number().integer().positive().required(),
  ingredients: Joi.when('type', {
    is: 'recipe',
    then: Joi.string().trim().min(3).max(3000).required(),
    otherwise: Joi.string().allow('').max(3000).optional(),
  }),
  instructions: Joi.when('type', {
    is: 'recipe',
    then: Joi.string().trim().min(3).max(3000).required(),
    otherwise: Joi.string().allow('').max(3000).optional(),
  }),
});

export const commentSchema = Joi.object({
  content: Joi.string().trim().min(1).max(1000).required(),
});

export const ratingSchema = Joi.object({
  score: Joi.number().integer().min(1).max(5).required(),
});

export const firstError = (error) => error.details[0].message;
