// Import the AgeRestrictionServices class from the ageRestrictionServices module
import { AgeRestrictionServices } from '../../services/ageRestrictionService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single age restriction by ID.
 *
 * This function handles the request to find a specific age restriction in the database
 * based on the provided ID. It calls the appropriate service method and returns
 * the age restriction data if found. If an error occurs or the record is not found, it is handled
 * appropriately using Boom.
 *
 * @param {Object} req - The request object, expected to contain the age restriction ID in the body.
 * @param {Object} res - The response object to send the age restriction data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the age restriction data or an error.
 */
export const listOneAgeRestriction = async (req, res, next) => {

  // Destructure the age restriction ID from the request body
  const { id } = req.body;

  // Instantiate the AgeRestrictionServices class to manage age restriction operations
  const ageRestrictionManager = new AgeRestrictionServices();

  try {
    // Attempt to find the age restriction record by ID
    const record = await ageRestrictionManager.listOne(id);

    // If the age restriction record is found, send a success response with the data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'Age restriction found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        ageRestriction: record
      });
    }

  } catch (error) {
    // Handle errors during the retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the age restriction from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};