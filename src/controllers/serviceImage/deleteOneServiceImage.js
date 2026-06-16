/**
 * Controller function to delete an existing service image.
 *
 * This function handles the request to delete a service image from the database,
 * ensuring that the service image belongs to a service owned by the specified business.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object containing the service image ID in params and business ID in body.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.serviceImageId - The ID of the service image to delete.
 * @param {Object} req.body - The request body containing the business ID.
 * @param {number} req.body.businessId - The ID of the business that should own the service.
 * @param {Object} res - The response object to send the deletion status.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the deletion status.
 */
export const deleteServiceImage = async (req, res, next) => {

  // Extract the serviceImageId from the request parameters
  const { serviceImageId } = req.params;
  
  // Extract the businessId from the request body
  const { businessId } = req.body;

  // Instantiate the ServiceImageServices class to manage the service image operations
  const serviceImageManager = new ServiceImageServices();

  try {
    // Validate that the serviceImageId parameter is provided and is a valid number
    if (!serviceImageId || isNaN(parseInt(serviceImageId))) {
      // If serviceImageId is missing or invalid, return a Boom bad request error
      const boomError = Boom.badRequest('Invalid or missing service image ID provided');
      return next(boomError);
    }

    // Validate that the businessId is provided and is a valid number
    if (!businessId || isNaN(parseInt(businessId))) {
      // If businessId is missing or invalid, return a Boom bad request error
      const boomError = Boom.badRequest('Invalid or missing business ID provided');
      return next(boomError);
    }

    // Attempt to delete the service image record from the database
    const deleteResult = await serviceImageManager.deleteOne(
      parseInt(serviceImageId), 
      parseInt(businessId)
    );

    // Send a success response with the deletion status
    return res.status(200).json({
      success: true,
      message: 'Service image deleted successfully',
      // Include the new token in the response
      authentication: res.locals.newUserToken,
      result: deleteResult
    });

  } catch (error) {
    // Handle errors during service image deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete service image from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};