/**
 * Controller function to retrieve a single service review by its ID.
 *
 * This function handles the request to retrieve a specific service review from the database,
 * invoking the appropriate service method and returning a response with the service review data.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object containing the service review ID in params.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.serviceReviewId - The ID of the service review to retrieve.
 * @param {Object} res - The response object to send the service review data.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the service review data.
 */
export const getServiceReviewById = async (req, res, next) => {

  // Extract the serviceReviewId from the request parameters
  const { serviceReviewId } = req.params;

  // Instantiate the ServiceReviewServices class to manage the service review operations
  const serviceReviewManager = new ServiceReviewServices();

  try {
    // Validate that the serviceReviewId parameter is provided and is a valid number
    if (!serviceReviewId || isNaN(parseInt(serviceReviewId))) {
      // If serviceReviewId is missing or invalid, return a Boom bad request error
      const boomError = Boom.badRequest('Invalid or missing service review ID provided');
      return next(boomError);
    }

    // Attempt to retrieve the service review record from the database
    const serviceReview = await serviceReviewManager.listOne(parseInt(serviceReviewId));

    // Send a success response with the service review data
    return res.status(200).json({
      success: true,
      message: 'Service review retrieved successfully',
      // Include the new token in the response
      authentication: res.locals.newUserToken,
      serviceReview: serviceReview
    });

  } catch (error) {
    // Handle errors during service review retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve service review from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};