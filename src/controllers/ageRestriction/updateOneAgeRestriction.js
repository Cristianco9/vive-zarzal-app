// Import the AgeRestrictionServices class from the ageRestrictionServices module
import { AgeRestrictionServices } from '../../services/ageRestrictionService.js';
// Import Boom to create HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to handle the update of an age restriction.
 *
 * This function processes requests to update an age restriction's details in the database. It accepts
 * the age restriction ID and the new age restriction data from the request body. If the update is successful,
 * it returns a success message. If there's an error, it handles the error appropriately.
 *
 * @param {Object} req - The request object, expected to contain the age restriction ID and new data in the body.
 * @param {Object} res - The response object to send the result of the update operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with a success message, or an error if the update fails.
 */
export const updateOneAgeRestriction = async (req, res, next) => {

  // Extract age restriction ID and new age restriction data from the request body
  const { id, newAgeRestrictionData } = req.body;

  // Instantiate the AgeRestrictionServices class to manage age restriction operations
  const ageRestrictionManager = new AgeRestrictionServices();

  try {
    // Attempt to update the age restriction details in the database
    const response = await ageRestrictionManager.updateOne(id, newAgeRestrictionData);

    // If the update is successful, return a 201 response with a success message
    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Age restriction updated successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during the update process by returning a 503 error
    const boomError = Boom.serverUnavailable(
      'Unable to update the age restriction in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};