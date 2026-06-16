// Import the LocationServices class from the locationServices module
import { LocationServices } from '../../services/locationServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all locations.
 *
 * This function handles the request to retrieve all locations from the database,
 * invoking the appropriate service method and returning a response with the list of locations.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of locations.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of locations.
 */
export const listAllLocations = async (req, res, next) => {

  // Instantiate the LocationServices class to manage the location operations
  const locationManager = new LocationServices();

  try {
    // Attempt to retrieve all location records from the database
    const allRecords = await locationManager.listAll();

    // If records are found, send a success response with the location data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Locations retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        locations: allRecords
      });
    }

  } catch (error) {
    // Handle errors during location retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve locations from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};