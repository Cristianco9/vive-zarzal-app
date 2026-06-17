// Import the ServiceReviewServices class from the serviceReviewServices module
import { ServiceReviewServices } from '../../services/serviceReviewService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';
/**
 * Controller function to delete an existing service review.
 *
 * This function handles the request to delete a service review from the database,
 * ensuring that the service review belongs to the specified user.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object containing the service review ID in params and user ID in body.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.serviceReviewId - The ID of the service review to delete.
 * @param {Object} req.body - The request body containing the user ID.
 * @param {number} req.body.userId - The ID of the user who should own the review.
 * @param {Object} res - The response object to send the deletion status.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the deletion status.
 */
export const deleteServiceReview = async (req, res, next) => {

  // Extract the serviceReviewId from the request parameters
  const { serviceReviewId } = req.params;
  
  // Extract the userId from the request body
  const { userId } = req.body;

  // Instantiate the ServiceReviewServices class to manage the service review operations
  const serviceReviewManager = new ServiceReviewServices();

  try {
    // Validate that the serviceReviewId parameter is provided and is a valid number
    if (!serviceReviewId || isNaN(parseInt(serviceReviewId))) {
      // If serviceReviewId is missing or invalid, return a Boom bad request error
      const boomError = Boom.badRequest('Invalid or missing service review ID provided');
      return next(boomError);
    }

    // Validate that the userId is provided and is a valid number
    if (!userId || isNaN(parseInt(userId))) {
      // If userId is missing or invalid, return a Boom bad request error
      const boomError = Boom.badRequest('Invalid or missing user ID provided');
      return next(boomError);
    }

    // Attempt to delete the service review record from the database
    const deleteResult = await serviceReviewManager.deleteOne(
      parseInt(serviceReviewId), 
      parseInt(userId)
    );

    // Send a success response with the deletion status
    return res.status(200).json({
      success: true,
      message: 'Service review deleted successfully',
      // Include the new token in the response
      authentication: res.locals.newUserToken,
      result: deleteResult
    });

  } catch (error) {
    // Handle errors during service review deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete service review from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};