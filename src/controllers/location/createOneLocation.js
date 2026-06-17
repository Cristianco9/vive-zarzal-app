// Import the LocationServices class from the locationServices module
import { LocationServices } from '../../services/locationService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new location.
 *
 * This function handles the request to create a new location by extracting
 * the necessary data from the request body, invoking the appropriate service
 * method, and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the location's data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOneLocation = async (req, res, next) => {

  // Extract the new location data from the request body
  const newLocation = {
    name: req.body.newLocationData.name,
    description: req.body.newLocationData.description,
    code: req.body.newLocationData.code,
    cityId: req.body.newLocationData.cityId,
  };

  // Instantiate the LocationServices class to manage the location operations
  const locationManager = new LocationServices();

  try {
    // Attempt to create a new location using the provided data
    const response = await locationManager.createOne(newLocation);

    // If the location is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Location created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during location creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the location in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};