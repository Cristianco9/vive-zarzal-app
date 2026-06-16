// Import the ServiceReviewServices class from the serviceReviewServices module
import { ServiceReviewServices } from '../../services/serviceReviewServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single service review by ID.
 *
 * This function handles the request to find a specific service review in the database
 * based on the provided ID. It calls the appropriate service method and returns
 * the service review data if found. If an error occurs or the record is not found, it is handled
 * appropriately using Boom.
 *
 * @param {Object} req - The request object, expected to contain the service review ID in the body.
 * @param {Object} res - The response object to send the service review data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the service review data or an error.
 */
export const listOneServiceReview = async (req, res, next) => {

  // Destructure the service review ID from the request body
  const { id } = req.body;

  // Instantiate the ServiceReviewServices class to manage service review operations
  const serviceReviewManager = new ServiceReviewServices();

  try {
    // Attempt to find the service review record by ID
    const record = await serviceReviewManager.listOne(id);

    // If the service review record is found, send a success response with the data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'Service review found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        serviceReview: record
      });
    }

  } catch (error) {
    // Handle errors during the retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the service review from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};