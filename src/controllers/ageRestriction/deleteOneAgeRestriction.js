// Import the AgeRestrictionServices class from the ageRestrictionServices module
import { AgeRestrictionServices } from '../../services/ageRestrictionServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete an age restriction.
 *
 * This function handles the request to delete an existing age restriction by extracting
 * the age restriction ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the age restriction ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneAgeRestriction = async (req, res, next) => {

  // Extract the age restriction ID from the request body
  const { id } = req.body;

  // Instantiate the AgeRestrictionServices class to manage the age restriction operations
  const ageRestrictionManager = new AgeRestrictionServices();

  try {
    // Attempt to delete the age restriction by the provided ID
    const response = await ageRestrictionManager.deleteOne(id);

    // If the age restriction is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Age restriction deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during age restriction deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the age restriction from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};