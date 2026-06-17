// Import the CountryServices class from the countryServices module
import { CountryServices } from '../../services/countryService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all countries.
 *
 * This function handles the request to retrieve all countries from the database,
 * invoking the appropriate service method and returning a response with the list of countries.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of countries.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of countries.
 */
export const listAllCountries = async (req, res, next) => {

  // Instantiate the CountryServices class to manage the country operations
  const countryManager = new CountryServices();

  try {
    // Attempt to retrieve all country records from the database
    const allRecords = await countryManager.listAll();

    // If records are found, send a success response with the country data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Countries retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        countries: allRecords
      });
    }

  } catch (error) {
    // Handle errors during country retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve countries from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};