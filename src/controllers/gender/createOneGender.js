// Import the GenderServices class from the genderService module
import { GenderServices } from '../../services/genderService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new gender.
 *
 * This function handles the request to create a new gender by extracting
 * the necessary data from the request body, invoking the appropriate service
 * method, and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the gender's data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOneGender = async (req, res, next) => {

  // Extract the new gender data from the request body
  const newGender = {
    name: req.body.newGenderData.name,
  };

  // Instantiate the GenderServices class to manage the gender operations
  const genderManager = new GenderServices();

  try {
    // Attempt to create a new gender using the provided data
    const response = await genderManager.createOne(newGender);

    // If the gender is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Gender created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during gender creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the gender in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};