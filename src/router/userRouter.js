// Import the Router class from Express
import { Router } from "express";
// Import the middleware to verify tokens from the authentication app
import { authAppVerifyToken } from
'../middlewares/tokenHandlers/authAppTokenHandler.js';
// Import the middleware to verify the API key from the client app
import { checkApiKey } from '../middlewares/apiAuthHandler.js';
// Import the middleware to verify the data types sended in the request
import { validatorHandler  } from '../middlewares/validatorHandler.js';
// Import the user data types schema
import { userSchema } from '../schemas/userSchema.js';
// Import the controllers functions to authenticate and manage users    

// Create a new Router instance
export const userRouter = Router();

// Define a POST route for users authentication
userRouter.post(
  // Route path to authenticate a users
  //'/login',
  // Middleware to validate the data type
  validatorHandler(userSchema, 'body'),
  // Middleware to verify the API key sended by the client before
  // proceeding to the controller
  //checkApiKey,
  // Controller function to login a user
  //loginUser
);