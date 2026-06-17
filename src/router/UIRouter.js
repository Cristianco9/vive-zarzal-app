// Import the Router class from Express
import { Router } from "express";
// Import the middleware to verify tokens from the authentication app
import { authAppVerifyToken } from
'../middlewares/tokenHandlers/authAppTokenHandler.js';
// Import the middleware to verify the API key from the client app
import { checkApiKey } from '../middlewares/apiAuthHandler.js';
// Import the middleware to verify the data types sended in the request
import { validatorHandler  } from '../middlewares/validatorHandler.js';
// Import the controllers functions to manage user interfaces templates
import { landingPage } from "../controllers/UI/landingPage.js";
import { dashboard } from "../controllers/UI/dashboard.js";

// Create a new Router instance
export const UIRouter = Router();

// Define a GET route for login view
UIRouter.get(
  // Route path display the landing page
  '/',
  // Controller function to render the landing page
  landingPage
);

// Define a GET route for login view
UIRouter.get(
  // Route path display the landing page
  '/dashboard',
  // Controller function to render the landing page
  dashboard
);