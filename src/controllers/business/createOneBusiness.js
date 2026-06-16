// Import the BusinessServices class from the businessServices module
import { BusinessServices } from '../../services/businessServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new business.
 *
 * This function handles the request to create a new business by extracting
 * the necessary data from the request body, invoking the appropriate service
 * method, and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the business's data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOneBusiness = async (req, res, next) => {

  // Extract the new business data from the request body
  const newBusiness = {
    name: req.body.newBusinessData.name,
    description: req.body.newBusinessData.description,
    facebook: req.body.newBusinessData.facebook,
    instagram: req.body.newBusinessData.instagram,
    tiktok: req.body.newBusinessData.tiktok,
    website: req.body.newBusinessData.website,
    ownerUserId: req.body.newBusinessData.ownerUserId,
    locationId: req.body.newBusinessData.locationId,
  };

  // Instantiate the BusinessServices class to manage the business operations
  const businessManager = new BusinessServices();

  try {
    // Attempt to create a new business using the provided data
    const response = await businessManager.createOne(newBusiness);

    // If the business is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Business created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during business creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the business in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};