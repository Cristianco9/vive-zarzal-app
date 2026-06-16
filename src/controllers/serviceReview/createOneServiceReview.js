// Import the ServiceReviewServices class from the serviceReviewServices module
import { ServiceReviewServices } from '../../services/serviceReviewServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new service review.
 *
 * This function handles the request to create a new service review in the database,
 * invoking the appropriate service method and returning a response with the creation status.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object containing the service review data in body.
 * @param {Object} req.body - The service review data to create.
 * @param {Object} res - The response object to send the creation status.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the creation status.
 */
export const createServiceReview = async (req, res, next) => {

  // Extract the service review data from the request body
  const serviceReviewData = req.body;

  // Instantiate the ServiceReviewServices class to manage the service review operations
  const serviceReviewManager = new ServiceReviewServices();

  try {
    // Attempt to create a new service review record in the database
    const creationResult = await serviceReviewManager.createOne(serviceReviewData);

    // Send a success response with the creation status
    return res.status(201).json({
      success: true,
      message: 'Service review created successfully',
      // Include the new token in the response
      authentication: res.locals.newUserToken,
      result: creationResult
    });

  } catch (error) {
    // Handle errors during service review creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create service review in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};