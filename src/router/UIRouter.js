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
import { login } from "../controllers/UI/login.js";
import { selectRole } from "../controllers/UI/selectRole.js";
import { registerAdvertiserForm } from "../controllers/UI/registerAdvertiserForm.js";
import { registerCustomerForm } from "../controllers/UI/registerCustomerForm.js";

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
  // Route path display the dashboard page
  '/dashboard',
  // Controller function to render the dashboard page
  dashboard
);

// Define a GET route for login view
UIRouter.get(
  // Route path display the login page
  '/auth/login',
  // Controller function to render the login page
  login
);

// Define a GET route for ladingPage view
UIRouter.get(
  // Route path display the landing page
  '/auth/logout',
  // Controller function to render the logout page
  landingPage
);

// Define a GET route for type user view
UIRouter.get(
  // Route path display the type user page
  '/auth/select-role',
  // Controller function to render the landing page
  selectRole
);

// Define a GET route for register customer form
UIRouter.get(
  // Route path display the register customer form
  '/auth/register/customer',
  // Controller function to render the register customer form
  registerCustomerForm
);

// Define a GET route for register advertiser form
UIRouter.get(
  // Route path display the register advertiser form
  '/auth/register/advertiser',
  // Controller function to render the register advertiser form
  registerCustomerForm
);