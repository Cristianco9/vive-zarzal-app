// Import the BusinessReviewServices class from the businessReviewServices module
import { BusinessReviewServices } from '../../services/businessReviewServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new business review.
 *
 * This function handles the request to create a new business review by extracting
 * the necessary data from the request body, invoking the appropriate service
 * method, and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the business review's data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOneBusinessReview = async (req, res, next) => {

  // Extract the new business review data from the request body
  const newBusinessReview = {
    businessId: req.body.newBusinessReviewData.businessId,
    userId: req.body.newBusinessReviewData.userId,
    content: req.body.newBusinessReviewData.content,
    rating: req.body.newBusinessReviewData.rating,
  };

  // Instantiate the BusinessReviewServices class to manage the business review operations
  const businessReviewManager = new BusinessReviewServices();

  try {
    // Attempt to create a new business review using the provided data
    const response = await businessReviewManager.createOne(newBusinessReview);

    // If the business review is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Business review created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during business review creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the business review in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};