// Import the CityServices class from the cityServices module
import { CityServices } from '../../services/cityServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single city by ID.
 *
 * This function handles the request to find a specific city in the database
 * based on the provided ID. It calls the appropriate service method and returns
 * the city data if found. If an error occurs or the city is not found, it is handled
 * appropriately using Boom.
 *
 * @param {Object} req - The request object, expected to contain the city ID in the body.
 * @param {Object} res - The response object to send the city data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the city data or an error.
 */
export const listOneCity = async (req, res, next) => {

  // Destructure the city ID from the request body
  const { id } = req.body;

  // Instantiate the CityServices class to manage city operations
  const cityManager = new CityServices();

  try {
    // Attempt to find the city record by ID
    const record = await cityManager.listOne(id);

    // If the city record is found, send a success response with the city data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'City found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        city: record
      });
    }

  } catch (error) {
    // Handle errors during the city retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the city from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};