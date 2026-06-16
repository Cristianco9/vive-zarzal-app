/**
 * Controller function to list all services belonging to a specific business.
 *
 * This function handles the request to retrieve all services associated with a particular business
 * from the database, invoking the appropriate service method and returning a response with the list of records.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object containing the business ID in params.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.businessId - The ID of the business whose services are to be retrieved.
 * @param {Object} res - The response object to send the list of services.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of services for the specified business.
 */
export const listServicesByBusiness = async (req, res, next) => {

  // Extract the businessId from the request parameters
  const { businessId } = req.params;

  // Instantiate the ServiceServices class to manage the service operations
  const serviceManager = new ServiceServices();

  try {
    // Validate that the businessId parameter is provided and is a valid number
    if (!businessId || isNaN(parseInt(businessId))) {
      // If businessId is missing or invalid, return a Boom bad request error
      const boomError = Boom.badRequest('Invalid or missing business ID provided');
      return next(boomError);
    }

    // Attempt to retrieve all service records for the specified business from the database
    const businessServices = await serviceManager.listByBusinessId(parseInt(businessId));

    // Send a success response with the retrieved services data
    return res.status(200).json({
      success: true,
      message: 'Services for the business retrieved successfully',
      // Include the new token in the response
      authentication: res.locals.newUserToken,
      services: businessServices,
      count: businessServices.length
    });

  } catch (error) {
    // Handle errors during service retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve services for the business from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};