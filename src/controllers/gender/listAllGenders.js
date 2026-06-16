// Import the GenderServices class from the genderService module
import { GenderServices } from '../../services/genderService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all genders.
 *
 * This function handles the request to retrieve all genders from the database,
 * invoking the appropriate service method and returning a response with the list of records.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of genders.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of genders.
 */
export const listAllGenders = async (req, res, next) => {

  // Instantiate the GenderServices class to manage the gender operations
  const genderManager = new GenderServices();

  try {
    // Attempt to retrieve all gender records from the database
    const allRecords = await genderManager.listAll();

    // If records are found, send a success response with the data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Genders retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        genders: allRecords
      });
    }

  } catch (error) {
    // Handle errors during gender retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve genders from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};