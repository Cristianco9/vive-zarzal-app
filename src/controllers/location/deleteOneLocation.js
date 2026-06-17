// Import the LocationServices class from the locationServices module
import { LocationServices } from '../../services/locationService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a location.
 *
 * This function handles the request to delete an existing location by extracting
 * the location ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the location ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneLocation = async (req, res, next) => {

  // Extract the location ID from the request body
  const { id } = req.body;

  // Instantiate the LocationServices class to manage the location operations
  const locationManager = new LocationServices();

  try {
    // Attempt to delete the location by the provided ID
    const response = await locationManager.deleteOne(id);

    // If the location is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Location deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during location deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the location from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};