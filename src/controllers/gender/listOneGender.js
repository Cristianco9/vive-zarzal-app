// Import the GenderServices class from the genderService module
import { GenderServices } from '../../services/genderService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single gender by ID.
 *
 * This function handles the request to find a specific gender in the database
 * based on the provided ID. It calls the appropriate service method and returns
 * the gender data if found. If an error occurs or the record is not found, it is handled
 * appropriately using Boom.
 *
 * @param {Object} req - The request object, expected to contain the gender ID in the body.
 * @param {Object} res - The response object to send the gender data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the gender data or an error.
 */
export const listOneGender = async (req, res, next) => {

  // Destructure the gender ID from the request body
  const { id } = req.body;

  // Instantiate the GenderServices class to manage gender operations
  const genderManager = new GenderServices();

  try {
    // Attempt to find the gender record by ID
    const record = await genderManager.listOne(id);

    // If the gender record is found, send a success response with the data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'Gender found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        gender: record
      });
    }

  } catch (error) {
    // Handle errors during the retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the gender from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};