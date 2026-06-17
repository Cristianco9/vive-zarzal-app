// Import the BusinessReviewServices class from the businessReviewServices module
import { BusinessReviewServices } from '../../services/businessReviewService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a business review.
 *
 * This function handles the request to delete an existing business review by extracting
 * the business review ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the business review ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneBusinessReview = async (req, res, next) => {

  // Extract the business review ID from the request body
  const { id } = req.body;

  // Instantiate the BusinessReviewServices class to manage the business review operations
  const businessReviewManager = new BusinessReviewServices();

  try {
    // Attempt to delete the business review by the provided ID
    const response = await businessReviewManager.deleteOne(id);

    // If the business review is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Business review deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during business review deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the business review from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};