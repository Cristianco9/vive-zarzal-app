// Import the ServiceReviewServices class from the serviceReviewServices module
import { ServiceReviewServices } from '../../services/serviceReviewService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new service review.
 *
 * This function handles the request to create a new service review in the database,
 * taking the author's identity from the verified JWT token instead of the request body
 * to prevent a user from creating reviews on behalf of another user.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req              - The request object containing the review data in body.
 * @param {Object} req.body         - The request body with the review fields.
 * @param {number} req.body.serviceId - The ID of the service being reviewed.
 * @param {string} [req.body.content] - Optional textual content of the review.
 * @param {number} [req.body.rating]  - Optional rating between 1 and 5.
 * @param {Object} req.user         - The authenticated user injected by the JWT middleware.
 * @param {number} req.user.id      - The ID of the authenticated user (review author).
 * @param {Object} res              - The response object to send the creation status.
 * @param {Function} next           - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the creation status.
 */
export const createServiceReview = async (req, res, next) => {

  // Extract the review fields from the request body
  const { serviceId, content, rating } = req.body;

  // Extract the authenticated user's ID from the JWT token — never trust the body for this
  const userId = req.user.id;

  // Instantiate the ServiceReviewServices class to manage the service review operations
  const serviceReviewManager = new ServiceReviewServices();

  try {
    // Attempt to create a new service review record in the database
    const result = await serviceReviewManager.createOne({
      serviceId,
      userId,
      content,
      rating,
    });

    // Send a success response with the creation status
    return res.status(201).json({
      success: true,
      message: 'Service review created successfully',
      // Include the refreshed token in the response
      authentication: res.locals.newUserToken,
      result,
    });

  } catch (error) {
    // Forward the Boom error (404 for missing service/user) or any unexpected error
    next(error);
  }
};