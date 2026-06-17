// Import the ServiceServices class from the serviceServices module
import { ServiceServices } from '../../services/serviceService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';
/**
 * Controller function to delete an existing service.
 *
 * This function handles the request to delete a service from the database,
 * ensuring that the service belongs to the specified business before allowing the deletion.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object containing the service ID in params and business ID in body.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.serviceId - The ID of the service to delete.
 * @param {Object} req.body - The request body containing the business ID.
 * @param {number} req.body.businessId - The ID of the business that should own the service.
 * @param {Object} res - The response object to send the deletion status.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the deletion status.
 */
export const deleteService = async (req, res, next) => {

  // Extract the serviceId from the request parameters
  const { serviceId } = req.params;
  
  // Extract the businessId from the request body
  const { businessId } = req.body;

  // Instantiate the ServiceServices class to manage the service operations
  const serviceManager = new ServiceServices();

  try {
    // Validate that the serviceId parameter is provided and is a valid number
    if (!serviceId || isNaN(parseInt(serviceId))) {
      // If serviceId is missing or invalid, return a Boom bad request error
      const boomError = Boom.badRequest('Invalid or missing service ID provided');
      return next(boomError);
    }

    // Validate that the businessId is provided and is a valid number
    if (!businessId || isNaN(parseInt(businessId))) {
      // If businessId is missing or invalid, return a Boom bad request error
      const boomError = Boom.badRequest('Invalid or missing business ID provided');
      return next(boomError);
    }

    // Attempt to delete the service record from the database
    const deleteResult = await serviceManager.deleteOne(
      parseInt(serviceId), 
      parseInt(businessId)
    );

    // Send a success response with the deletion status
    return res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
      // Include the new token in the response
      authentication: res.locals.newUserToken,
      result: deleteResult
    });

  } catch (error) {
    // Handle errors during service deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete service from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};