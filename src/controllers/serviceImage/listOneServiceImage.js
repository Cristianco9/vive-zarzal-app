/**
 * Controller function to retrieve a single service image by its ID.
 *
 * This function handles the request to retrieve a specific service image from the database,
 * invoking the appropriate service method and returning a response with the service image data.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object containing the service image ID in params.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.serviceImageId - The ID of the service image to retrieve.
 * @param {Object} res - The response object to send the service image data.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the service image data.
 */
export const getServiceImageById = async (req, res, next) => {

  // Extract the serviceImageId from the request parameters
  const { serviceImageId } = req.params;

  // Instantiate the ServiceImageServices class to manage the service image operations
  const serviceImageManager = new ServiceImageServices();

  try {
    // Validate that the serviceImageId parameter is provided and is a valid number
    if (!serviceImageId || isNaN(parseInt(serviceImageId))) {
      // If serviceImageId is missing or invalid, return a Boom bad request error
      const boomError = Boom.badRequest('Invalid or missing service image ID provided');
      return next(boomError);
    }

    // Attempt to retrieve the service image record from the database
    const serviceImage = await serviceImageManager.listOne(parseInt(serviceImageId));

    // Send a success response with the service image data
    return res.status(200).json({
      success: true,
      message: 'Service image retrieved successfully',
      // Include the new token in the response
      authentication: res.locals.newUserToken,
      serviceImage: serviceImage
    });

  } catch (error) {
    // Handle errors during service image retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve service image from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};