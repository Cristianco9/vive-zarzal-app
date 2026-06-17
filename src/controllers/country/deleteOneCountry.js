// Import the CountryServices class from the countryServices module
import { CountryServices } from '../../services/countryService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a country.
 *
 * This function handles the request to delete an existing country by extracting
 * the country ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the country ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneCountry = async (req, res, next) => {

  // Extract the country ID from the request body
  const { id } = req.body;

  // Instantiate the CountryServices class to manage the country operations
  const countryManager = new CountryServices();

  try {
    // Attempt to delete the country by the provided ID
    const response = await countryManager.deleteOne(id);

    // If the country is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Country deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during country deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the country from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};