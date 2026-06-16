// Import the AgeRestrictionServices class from the ageRestrictionServices module
import { AgeRestrictionServices } from '../../services/ageRestrictionServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all age restrictions.
 *
 * This function handles the request to retrieve all age restrictions from the database,
 * invoking the appropriate service method and returning a response with the list of records.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of age restrictions.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of age restrictions.
 */
export const listAllAgeRestrictions = async (req, res, next) => {

  // Instantiate the AgeRestrictionServices class to manage the age restriction operations
  const ageRestrictionManager = new AgeRestrictionServices();

  try {
    // Attempt to retrieve all age restriction records from the database
    const allRecords = await ageRestrictionManager.listAll();

    // If records are found, send a success response with the data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Age restrictions retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        ageRestrictions: allRecords
      });
    }

  } catch (error) {
    // Handle errors during age restriction retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve age restrictions from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};