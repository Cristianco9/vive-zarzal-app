// Import the BusinessReviewServices class from the businessReviewServices module
import { BusinessReviewServices } from '../../services/businessReviewServices.js';
// Import Boom to create HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to handle the update of a business review.
 *
 * This function processes requests to update a business review's details in the database. It accepts
 * the business review ID and the new data from the request body. If the update is successful,
 * it returns a success message. If there's an error, it handles the error appropriately.
 *
 * @param {Object} req - The request object, expected to contain the business review ID and new data in the body.
 * @param {Object} res - The response object to send the result of the update operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with a success message, or an error if the update fails.
 */
export const updateOneBusinessReview = async (req, res, next) => {

  // Extract business review ID and new business review data from the request body
  const { id, newBusinessReviewData } = req.body;

  // Instantiate the BusinessReviewServices class to manage business review operations
  const businessReviewManager = new BusinessReviewServices();

  try {
    // Attempt to update the business review details in the database
    const response = await businessReviewManager.updateOne(id, newBusinessReviewData);

    // If the update is successful, return a 201 response with a success message
    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Business review updated successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during the update process by returning a 503 error
    const boomError = Boom.serverUnavailable(
      'Unable to update the business review in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};