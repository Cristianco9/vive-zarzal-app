/**
 * Controller function to update an existing service image.
 *
 * This function handles the request to update a service image in the database,
 * ensuring that the service image belongs to a service owned by the specified business.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object containing the service image ID in params and update data in body.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.serviceImageId - The ID of the service image to update.
 * @param {Object} req.body - The service image update data.
 * @param {number} req.body.businessId - The ID of the business that should own the service.
 * @param {Object} res - The response object to send the update status.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the update status.
 */
export const updateServiceImage = async (req, res, next) => {

  // Extract the serviceImageId from the request parameters
  const { serviceImageId } = req.params;
  
  // Extract the update data and businessId from the request body
  const { businessId, ...updateData } = req.body;

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

    // Attempt to update the service image record in the database
    const updateResult = await serviceImageManager.updateOne(
      parseInt(serviceImageId), 
      parseInt(businessId), 
      updateData
    );

    // Send a success response with the update status
    return res.status(200).json({
      success: true,
      message: 'Service image updated successfully',
      // Include the new token in the response
      authentication: res.locals.newUserToken,
      result: updateResult
    });

  } catch (error) {
    // Handle errors during service image update by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to update service image in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};