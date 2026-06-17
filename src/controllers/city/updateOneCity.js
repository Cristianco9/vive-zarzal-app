// Import the CityServices class from the cityServices module
import { CityServices } from '../../services/cityService.js';
// Import Boom to create HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to handle the update of a city.
 *
 * This function processes requests to update a city's details in the database. It accepts
 * the city ID and the new city data from the request body. If the update is successful,
 * it returns a success message. If there's an error, it handles the error appropriately.
 *
 * @param {Object} req - The request object, expected to contain the city ID and new city data in the body.
 * @param {Object} res - The response object to send the result of the update operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with a success message, or an error if the update fails.
 */
export const updateOneCity = async (req, res, next) => {

  // Extract city ID and new city data from the request body
  const { id, newCityData } = req.body;

  // Instantiate the CityServices class to manage city operations
  const cityManager = new CityServices();

  try {
    // Attempt to update the city details in the database
    const response = await cityManager.updateOne(id, newCityData);

    // If the update is successful, return a 201 response with a success message
    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'City updated successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during the update process by returning a 503 error
    const boomError = Boom.serverUnavailable(
      'Unable to update the city in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};