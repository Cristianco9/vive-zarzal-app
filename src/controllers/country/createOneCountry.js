// Import the CountryServices class from the countryServices module
import { CountryServices } from '../../services/countryService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new country.
 *
 * This function handles the request to create a new country by extracting
 * the necessary data from the request body, invoking the appropriate service
 * method, and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the country's data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOneCountry = async (req, res, next) => {

  // Extract the new country data from the request body
  const newCountry = {
    name: req.body.newCountryData.name,
    description: req.body.newCountryData.description,
  };

  // Instantiate the CountryServices class to manage the country operations
  const countryManager = new CountryServices();

  try {
    // Attempt to create a new country using the provided data
    const response = await countryManager.createOne(newCountry);

    // If the country is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Country created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during country creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the country in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};