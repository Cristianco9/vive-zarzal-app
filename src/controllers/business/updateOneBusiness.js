// Import the BusinessServices class from the businessServices module
import { BusinessServices } from '../../services/businessService.js';
// Import Boom to create HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to handle the update of a business.
 *
 * This function processes requests to update a business's details in the database. It accepts
 * the business ID and the new business data from the request body. If the update is successful,
 * it returns a success message. If there's an error, it handles the error appropriately.
 *
 * @param {Object} req - The request object, expected to contain the business ID and new business data in the body.
 * @param {Object} res - The response object to send the result of the update operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with a success message, or an error if the update fails.
 */
export const updateOneBusiness = async (req, res, next) => {

  // Extract business ID and new business data from the request body
  const { id, newBusinessData } = req.body;

  // Instantiate the BusinessServices class to manage business operations
  const businessManager = new BusinessServices();

  try {
    // Attempt to update the business details in the database
    const response = await businessManager.updateOne(id, newBusinessData);

    // If the update is successful, return a 201 response with a success message
    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Business updated successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during the update process by returning a 503 error
    const boomError = Boom.serverUnavailable(
      'Unable to update the business in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};