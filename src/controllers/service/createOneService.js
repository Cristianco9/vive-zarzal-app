// Import the ServiceServices class from the serviceServices module
import { ServiceServices } from '../../services/serviceServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new service.
 *
 * This function handles the request to create a new service by extracting
 * the necessary data from the request body, invoking the appropriate service
 * method, and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the service's data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOneService = async (req, res, next) => {

  // Extract the new service data from the request body
  const newService = {
    name: req.body.newServiceData.name,
    description: req.body.newServiceData.description,
    price: req.body.newServiceData.price,
    categoryId: req.body.newServiceData.categoryId,
    statusId: req.body.newServiceData.statusId,
    ageRestrictionId: req.body.newServiceData.ageRestrictionId,
    businessId: req.body.newServiceData.businessId,
  };

  // Instantiate the ServiceServices class to manage the service operations
  const serviceManager = new ServiceServices();

  try {
    // Attempt to create a new service using the provided data
    const response = await serviceManager.createOne(newService);

    // If the service is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Service created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during service creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the service in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};