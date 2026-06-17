// Import the ServiceReviewServices class from the serviceReviewServices module
import { ServiceReviewServices } from '../../services/serviceReviewService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to update an existing service review.
 *
 * This function handles the request to update a service review in the database,
 * ensuring that only the owner of the review can modify it. The user identity is
 * taken from the verified JWT token — the request body must NOT include userId,
 * as accepting it from the client would allow impersonation attacks.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req                   - The request object containing the review ID in params and update data in body.
 * @param {Object} req.params            - The route parameters.
 * @param {string} req.params.id         - The ID of the service review to update.
 * @param {Object} req.body              - The request body with the fields to update.
 * @param {string} [req.body.content]    - Optional new textual content of the review.
 * @param {number} [req.body.rating]     - Optional new rating between 1 and 5.
 * @param {Object} req.user              - The authenticated user injected by the JWT middleware.
 * @param {number} req.user.id           - The ID of the authenticated user (must be the review owner).
 * @param {Object} res                   - The response object to send the update status.
 * @param {Function} next                - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the update status.
 */
export const updateServiceReview = async (req, res, next) => {

  // Extract the service review ID from the route parameters
  const { id } = req.params;

  // Extract the authenticated user's ID from the JWT token — never trust the body for this
  const userId = req.user.id;

  // Extract only the allowed update fields — userId is intentionally excluded from the body
  const { content, rating } = req.body;

  // Instantiate the ServiceReviewServices class to manage the service review operations
  const serviceReviewManager = new ServiceReviewServices();

  try {
    // Attempt to update the service review record — the service layer enforces ownership
    const result = await serviceReviewManager.updateOne(
      Number(id),
      userId,
      { content, rating }
    );

    // Send a success response with the update status
    return res.status(200).json({
      success: true,
      message: 'Service review updated successfully',
      // Include the refreshed token in the response
      authentication: res.locals.newUserToken,
      result,
    });

  } catch (error) {
    // Forward the Boom error (400 bad request, 404 not found) or any unexpected error
    next(error);
  }
};