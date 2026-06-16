// Import the ServiceReviewServices class from the serviceReviewServices module
import { ServiceReviewServices } from '../../services/serviceReviewServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all service reviews.
 *
 * This function handles the request to retrieve all service reviews from the database,
 * invoking the appropriate service method and returning a response with the list of records.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of service reviews.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of service reviews.
 */
export const listAllServiceReviews = async (req, res, next) => {

  // Instantiate the ServiceReviewServices class to manage the service review operations
  const serviceReviewManager = new ServiceReviewServices();

  try {
    // Attempt to retrieve all service review records from the database
    const allRecords = await serviceReviewManager.listAll();

    // If records are found, send a success response with the data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Service reviews retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        serviceReviews: allRecords
      });
    }

  } catch (error) {
    // Handle errors during service review retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve service reviews from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};