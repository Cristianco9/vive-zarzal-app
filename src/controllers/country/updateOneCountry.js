// Import the CountryServices class from the countryServices module
import { CountryServices } from '../../services/countryServices.js';
// Import Boom to create HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to handle the update of a country.
 *
 * This function processes requests to update a country's details in the database. It accepts
 * the country ID and the new country data from the request body. If the update is successful,
 * it returns a success message. If there's an error, it handles the error appropriately.
 *
 * @param {Object} req - The request object, expected to contain the country ID and new country data in the body.
 * @param {Object} res - The response object to send the result of the update operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with a success message, or an error if the update fails.
 */
export const updateOneCountry = async (req, res, next) => {

  // Extract country ID and new country data from the request body
  const { id, newCountryData } = req.body;

  // Instantiate the CountryServices class to manage country operations
  const countryManager = new CountryServices();

  try {
    // Attempt to update the country details in the database
    const response = await countryManager.updateOne(id, newCountryData);

    // If the update is successful, return a 201 response with a success message
    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Country updated successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during the update process by returning a 503 error
    const boomError = Boom.serverUnavailable(
      'Unable to update the country in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};