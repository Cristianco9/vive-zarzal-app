// Import the ServiceReviewServices class from the serviceReviewServices module
import { ServiceReviewServices } from '../../services/serviceReviewService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';
/**
 * Controller function to update an existing service review.
 *
 * This function handles the request to update a service review in the database,
 * ensuring that the service review belongs to the specified user.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object containing the service review ID in params and update data in body.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.serviceReviewId - The ID of the service review to update.
 * @param {Object} req.body - The service review update data.
 * @param {number} req.body.userId - The ID of the user who should own the review.
 * @param {Object} res - The response object to send the update status.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the update status.
 */
export const updateServiceReview = async (req, res, next) => {

  // Extract the serviceReviewId from the request parameters
  const { serviceReviewId } = req.params;
  
  // Extract the update data and userId from the request body
  const { userId, ...updateData } = req.body;

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

    // Attempt to update the service review record in the database
    const updateResult = await serviceReviewManager.updateOne(
      parseInt(serviceReviewId), 
      parseInt(userId), 
      updateData
    );

    // Send a success response with the update status
    return res.status(200).json({
      success: true,
      message: 'Service review updated successfully',
      // Include the new token in the response
      authentication: res.locals.newUserToken,
      result: updateResult
    });

  } catch (error) {
    // Handle errors during service review update by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to update service review in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};