// Import the AgeRestrictionServices class from the ageRestrictionServices module
import { AgeRestrictionServices } from '../../services/ageRestrictionServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new age restriction.
 *
 * This function handles the request to create a new age restriction by extracting
 * the necessary data from the request body, invoking the appropriate service
 * method, and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the age restriction's data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOneAgeRestriction = async (req, res, next) => {

  // Extract the new age restriction data from the request body
  const newAgeRestriction = {
    name: req.body.newAgeRestrictionData.name,
    description: req.body.newAgeRestrictionData.description,
  };

  // Instantiate the AgeRestrictionServices class to manage the age restriction operations
  const ageRestrictionManager = new AgeRestrictionServices();

  try {
    // Attempt to create a new age restriction using the provided data
    const response = await ageRestrictionManager.createOne(newAgeRestriction);

    // If the age restriction is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Age restriction created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during age restriction creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the age restriction in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};