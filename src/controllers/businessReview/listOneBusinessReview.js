// Import the BusinessReviewServices class from the businessReviewServices module
import { BusinessReviewServices } from '../../services/businessReviewServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single business review by ID.
 *
 * This function handles the request to find a specific business review in the database
 * based on the provided ID. It calls the appropriate service method and returns
 * the business review data if found. If an error occurs or the record is not found, it is handled
 * appropriately using Boom.
 *
 * @param {Object} req - The request object, expected to contain the business review ID in the body.
 * @param {Object} res - The response object to send the business review data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the business review data or an error.
 */
export const listOneBusinessReview = async (req, res, next) => {

  // Destructure the business review ID from the request body
  const { id } = req.body;

  // Instantiate the BusinessReviewServices class to manage business review operations
  const businessReviewManager = new BusinessReviewServices();

  try {
    // Attempt to find the business review record by ID
    const record = await businessReviewManager.listOne(id);

    // If the business review record is found, send a success response with the data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'Business review found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        businessReview: record
      });
    }

  } catch (error) {
    // Handle errors during the retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the business review from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};