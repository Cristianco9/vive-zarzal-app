// Import the BusinessReviewServices class from the businessReviewServices module
import { BusinessReviewServices } from '../../services/businessReviewService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all business reviews.
 *
 * This function handles the request to retrieve all business reviews from the database,
 * invoking the appropriate service method and returning a response with the list of records.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of business reviews.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of business reviews.
 */
export const listAllBusinessReviews = async (req, res, next) => {

  // Instantiate the BusinessReviewServices class to manage the business review operations
  const businessReviewManager = new BusinessReviewServices();

  try {
    // Attempt to retrieve all business review records from the database
    const allRecords = await businessReviewManager.listAll();

    // If records are found, send a success response with the data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Business reviews retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        businessReviews: allRecords
      });
    }

  } catch (error) {
    // Handle errors during business review retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve business reviews from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};