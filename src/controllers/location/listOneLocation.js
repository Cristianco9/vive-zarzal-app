// Import the LocationServices class from the locationServices module
import { LocationServices } from '../../services/locationServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single location by ID.
 *
 * This function handles the request to find a specific location in the database
 * based on the provided ID. It calls the appropriate service method and returns
 * the location data if found. If an error occurs or the location is not found, it is handled
 * appropriately using Boom.
 *
 * @param {Object} req - The request object, expected to contain the location ID in the body.
 * @param {Object} res - The response object to send the location data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the location data or an error.
 */
export const listOneLocation = async (req, res, next) => {

  // Destructure the location ID from the request body
  const { id } = req.body;

  // Instantiate the LocationServices class to manage location operations
  const locationManager = new LocationServices();

  try {
    // Attempt to find the location record by ID
    const record = await locationManager.listOne(id);

    // If the location record is found, send a success response with the location data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'Location found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        location: record
      });
    }

  } catch (error) {
    // Handle errors during the location retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the location from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};