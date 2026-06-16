// Import the GenderServices class from the genderService module
import { GenderServices } from '../../services/genderService.js';
// Import Boom to create HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to handle the update of a gender.
 *
 * This function processes requests to update a gender's details in the database. It accepts
 * the gender ID and the new data from the request body. If the update is successful,
 * it returns a success message. If there's an error, it handles the error appropriately.
 *
 * @param {Object} req - The request object, expected to contain the gender ID and new data in the body.
 * @param {Object} res - The response object to send the result of the update operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with a success message, or an error if the update fails.
 */
export const updateOneGender = async (req, res, next) => {

  // Extract gender ID and new gender data from the request body
  const { id, newGenderData } = req.body;

  // Instantiate the GenderServices class to manage gender operations
  const genderManager = new GenderServices();

  try {
    // Attempt to update the gender details in the database
    const response = await genderManager.updateOne(id, newGenderData);

    // If the update is successful, return a 201 response with a success message
    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Gender updated successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during the update process by returning a 503 error
    const boomError = Boom.serverUnavailable(
      'Unable to update the gender in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};