// Import the GenderServices class from the genderService module
import { GenderServices } from '../../services/genderService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a gender.
 *
 * This function handles the request to delete an existing gender by extracting
 * the gender ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the gender ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneGender = async (req, res, next) => {

  // Extract the gender ID from the request body
  const { id } = req.body;

  // Instantiate the GenderServices class to manage the gender operations
  const genderManager = new GenderServices();

  try {
    // Attempt to delete the gender by the provided ID
    const response = await genderManager.deleteOne(id);

    // If the gender is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Gender deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during gender deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the gender from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};