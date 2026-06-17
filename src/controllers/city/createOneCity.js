// Import the CityServices class from the cityServices module
import { CityServices } from '../../services/cityService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new city.
 *
 * This function handles the request to create a new city by extracting
 * the necessary data from the request body, invoking the appropriate service
 * method, and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the city's data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOneCity = async (req, res, next) => {

  // Extract the new city data from the request body
  const newCity = {
    name: req.body.newCityData.name,
    description: req.body.newCityData.description,
    departmentId: req.body.newCityData.departmentId,
  };

  // Instantiate the CityServices class to manage the city operations
  const cityManager = new CityServices();

  try {
    // Attempt to create a new city using the provided data
    const response = await cityManager.createOne(newCity);

    // If the city is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'City created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during city creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the city in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};