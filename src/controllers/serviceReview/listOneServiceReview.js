// Import the ServiceReviewServices class from the serviceReviewServices module
import { ServiceReviewServices } from '../../services/serviceReviewServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single service review by its ID.
 *
 * This function handles the request to retrieve a specific service review from the database,
 * invoking the appropriate service method and returning a response with the full review data,
 * including its related service and user records.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req           - The request object containing the review ID in params.
 * @param {Object} req.params    - The route parameters.
 * @param {string} req.params.id - The ID of the service review to retrieve.
 * @param {Object} res           - The response object to send the service review data.
 * @param {Function} next        - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the service review data.
 */
export const getServiceReviewById = async (req, res, next) => {

  // Extract the service review ID from the route parameters
  const { id } = req.params;

  // Instantiate the ServiceReviewServices class to manage the service review operations
  const serviceReviewManager = new ServiceReviewServices();

  try {
    // Attempt to retrieve the service review record from the database
    const serviceReview = await serviceReviewManager.listOne(Number(id));

    // Send a success response with the retrieved service review data
    return res.status(200).json({
      success: true,
      message: 'Service review retrieved successfully',
      // Include the refreshed token in the response
      authentication: res.locals.newUserToken,
      serviceReview,
    });

  } catch (error) {
    // Forward the Boom error (400 bad request, 404 not found) or any unexpected error
    next(error);
  }
};