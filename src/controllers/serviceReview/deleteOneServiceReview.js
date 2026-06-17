// Import the ServiceReviewServices class from the serviceReviewServices module
import { ServiceReviewServices } from '../../services/serviceReviewService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete an existing service review.
 *
 * This function handles the request to delete a service review from the database,
 * ensuring that only the owner of the review can remove it. The user identity is
 * taken from the verified JWT token — the request body must NOT include userId,
 * as accepting it from the client would allow a user to delete reviews they do not own.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req           - The request object containing the review ID in params.
 * @param {Object} req.params    - The route parameters.
 * @param {string} req.params.id - The ID of the service review to delete.
 * @param {Object} req.user      - The authenticated user injected by the JWT middleware.
 * @param {number} req.user.id   - The ID of the authenticated user (must be the review owner).
 * @param {Object} res           - The response object to send the deletion status.
 * @param {Function} next        - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the deletion status.
 */
export const deleteServiceReview = async (req, res, next) => {

  // Extract the service review ID from the route parameters
  const { id } = req.params;

  // Extract the authenticated user's ID from the JWT token — never trust the body for this
  const userId = req.user.id;

  // Instantiate the ServiceReviewServices class to manage the service review operations
  const serviceReviewManager = new ServiceReviewServices();

  try {
    // Attempt to delete the service review record — the service layer enforces ownership
    const result = await serviceReviewManager.deleteOne(Number(id), userId);

    // Send a success response with the deletion status
    return res.status(200).json({
      success: true,
      message: 'Service review deleted successfully',
      // Include the refreshed token in the response
      authentication: res.locals.newUserToken,
      result,
    });

  } catch (error) {
    // Forward the Boom error (400 bad request, 404 not found) or any unexpected error
    next(error);
  }
};