// Import the CityServices class from the cityServices module
import { CityServices } from '../../services/cityService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all cities.
 *
 * This function handles the request to retrieve all cities from the database,
 * invoking the appropriate service method and returning a response with the list of cities.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of cities.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of cities.
 */
export const listAllCities = async (req, res, next) => {

  // Instantiate the CityServices class to manage the city operations
  const cityManager = new CityServices();

  try {
    // Attempt to retrieve all city records from the database
    const allRecords = await cityManager.listAll();

    // If records are found, send a success response with the city data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Cities retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        cities: allRecords
      });
    }

  } catch (error) {
    // Handle errors during city retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve cities from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};