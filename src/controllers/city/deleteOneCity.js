// Import the CityServices class from the cityServices module
import { CityServices } from '../../services/cityService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a city.
 *
 * This function handles the request to delete an existing city by extracting
 * the city ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the city ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneCity = async (req, res, next) => {

  // Extract the city ID from the request body
  const { id } = req.body;

  // Instantiate the CityServices class to manage the city operations
  const cityManager = new CityServices();

  try {
    // Attempt to delete the city by the provided ID
    const response = await cityManager.deleteOne(id);

    // If the city is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'City deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during city deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the city from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};