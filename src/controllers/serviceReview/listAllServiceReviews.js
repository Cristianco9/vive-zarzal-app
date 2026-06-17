// Import the ServiceReviewServices class from the serviceReviewServices module
import { ServiceReviewServices } from '../../services/serviceReviewService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all service reviews in the system.
 *
 * This function handles the request to retrieve every service review from the database,
 * invoking the appropriate service method and returning a response with the full list of records.
 * This is an administrative endpoint — no ownership filter is applied.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object}   req  - The request object.
 * @param {Object}   res  - The response object to send the list of service reviews.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of all service reviews.
 */
export const listAllServiceReviews = async (req, res, next) => {

  // Instantiate the ServiceReviewServices class to manage the service review operations
  const serviceReviewManager = new ServiceReviewServices();

  try {
    // Attempt to retrieve all service review records from the database
    const allRecords = await serviceReviewManager.listAll();

    // Send a success response with the retrieved service reviews data
    return res.status(200).json({
      success: true,
      message: 'Service reviews retrieved successfully',
      // Include the refreshed token in the response
      authentication: res.locals.newUserToken,
      serviceReviews: allRecords,
      count: allRecords.length,
    });

  } catch (error) {
    // Forward any unexpected error to the centralized error handler
    next(error);
  }
};