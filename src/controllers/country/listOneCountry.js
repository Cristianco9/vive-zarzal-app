// Import the CountryServices class from the countryServices module
import { CountryServices } from '../../services/countryServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single country by ID.
 *
 * This function handles the request to find a specific country in the database
 * based on the provided ID. It calls the appropriate service method and returns
 * the country data if found. If an error occurs or the country is not found, it is handled
 * appropriately using Boom.
 *
 * @param {Object} req - The request object, expected to contain the country ID in the body.
 * @param {Object} res - The response object to send the country data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the country data or an error.
 */
export const listOneCountry = async (req, res, next) => {

  // Destructure the country ID from the request body
  const { id } = req.body;

  // Instantiate the CountryServices class to manage country operations
  const countryManager = new CountryServices();

  try {
    // Attempt to find the country record by ID
    const record = await countryManager.listOne(id);

    // If the country record is found, send a success response with the country data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'Country found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        country: record
      });
    }

  } catch (error) {
    // Handle errors during the country retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the country from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};