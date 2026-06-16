// Import the ServiceReviewServices class from the serviceReviewServices module
import { ServiceReviewServices } from '../../services/serviceReviewServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a service review.
 *
 * This function handles the request to delete an existing service review by extracting
 * the service review ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the service review ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneServiceReview = async (req, res, next) => {

  // Extract the service review ID from the request body
  const { id } = req.body;

  // Instantiate the ServiceReviewServices class to manage the service review operations
  const serviceReviewManager = new ServiceReviewServices();

  try {
    // Attempt to delete the service review by the provided ID
    const response = await serviceReviewManager.deleteOne(id);

    // If the service review is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Service review deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during service review deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the service review from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};