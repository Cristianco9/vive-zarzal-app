// Import the ServiceReviewServices class from the serviceReviewServices module
import { ServiceReviewServices } from '../../services/serviceReviewService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all service reviews that belong to a specific user.
 *
 * This function handles the request to retrieve all service reviews associated with a user,
 * invoking the appropriate service method and returning a response with the list of records.
 * The userId is taken from the route parameters, allowing an administrator to query any user's
 * reviews, or a cliente to query their own by passing their own ID.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req              - The request object containing the user ID in params.
 * @param {Object} req.params       - The route parameters.
 * @param {string} req.params.userId - The ID of the user whose reviews to retrieve.
 * @param {Object} res              - The response object to send the list of service reviews.
 * @param {Function} next           - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of service reviews.
 */
export const listServiceReviewsByUser = async (req, res, next) => {

  // Extract the userId from the request parameters
  const { userId } = req.params;

  // Instantiate the ServiceReviewServices class to manage the service review operations
  const serviceReviewManager = new ServiceReviewServices();

  try {
    // Attempt to retrieve all service reviews for the specified user
    const userReviews = await serviceReviewManager.listByUserId(Number(userId));

    // Send a success response with the retrieved service reviews data
    return res.status(200).json({
      success: true,
      message: 'User service reviews retrieved successfully',
      // Include the refreshed token in the response
      authentication: res.locals.newUserToken,
      serviceReviews: userReviews,
      count: userReviews.length,
    });

  } catch (error) {
    // Forward the Boom error (400 bad request, 404 user not found) or any unexpected error
    next(error);
  }
};