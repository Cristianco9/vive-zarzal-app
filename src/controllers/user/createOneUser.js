// controller snippet — update your existing createOneUser
import Boom from '@hapi/boom';
// Import the UserServices class from the userServices module
import { UserServices } from '../../services/userService.js'; 
import Sequelize from 'sequelize';

export const createOneUser = async (req, res, next) => {
  try {
    // Log the incoming body so we can see exact shape
    console.log('CREATE USER BODY:', JSON.stringify(req.body));

    const userManager = new UserServices();
    const body = req.body || {};

    // Support both shapes: { newUserData: {...}, business: {...} } or flat {...}
    const newUserData = body.newUserData && typeof body.newUserData === 'object'
      ? body.newUserData
      : body;

    const business = body.business && typeof body.business === 'object'
      ? body.business
      : null;

    let result;
    if (business) {
      // If you have a service method that creates user + business in transaction
      result = await userManager.createOneWithBusiness({ newUserData, business });
    } else {
      result = await userManager.createOne(newUserData);
    }

    return res.status(201).json(result);
  } catch (error) {
    // Log full error and stack
    console.error('createOneUser ERROR:', error && (error.stack || error));

    // Handle common Sequelize DB errors with friendly responses
    if (error && error.name === 'SequelizeUniqueConstraintError') {
      const fields = Object.keys(error.fields || {}).join(', ');
      return res.status(409).json({
        statusCode: 409,
        error: 'Conflict',
        message: `Duplicate value for fields: ${fields}`,
        details: error.errors?.map(e => e.message) || []
      });
    }

    if (error && error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Foreign key constraint error (related resource not found)'
      });
    }

    // If it's already a Boom error, forward it
    if (Boom.isBoom && Boom.isBoom(error)) return next(error);

    // Fallback: wrap and forward
    return next(Boom.boomify(error, { message: 'Unable to create user' }));
  }
};