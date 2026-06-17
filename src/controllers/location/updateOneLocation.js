// Import the LocationServices class from the locationServices module
import { LocationServices } from '../../services/locationService.js';
// Import Boom to create HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to handle the update of a location.
 *
 * This function processes requests to update a location's details in the database. It accepts
 * the location ID and the new location data from the request body. If the update is successful,
 * it returns a success message. If there's an error, it handles the error appropriately.
 *
 * @param {Object} req - The request object, expected to contain the location ID and new location data in the body.
 * @param {Object} res - The response object to send the result of the update operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with a success message, or an error if the update fails.
 */
export const updateOneLocation = async (req, res, next) => {

  // Extract location ID and new location data from the request body
  const { id, newLocationData } = req.body;

  // Instantiate the LocationServices class to manage location operations
  const locationManager = new LocationServices();

  try {
    // Attempt to update the location details in the database
    const response = await locationManager.updateOne(id, newLocationData);

    // If the update is successful, return a 201 response with a success message
    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Location updated successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during the update process by returning a 503 error
    const boomError = Boom.serverUnavailable(
      'Unable to update the location in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};