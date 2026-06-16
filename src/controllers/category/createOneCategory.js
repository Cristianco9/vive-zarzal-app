// Import the CategoryServices class from the categoryServices module
import { CategoryServices } from '../../services/categoryServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new category.
 *
 * This function handles the request to create a new category by extracting
 * the necessary data from the request body, invoking the appropriate service
 * method, and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the category's data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOneCategory = async (req, res, next) => {

  // Extract the new category data from the request body
  const newCategory = {
    name: req.body.newCategoryData.name,
    description: req.body.newCategoryData.description,
  };

  // Instantiate the CategoryServices class to manage the category operations
  const categoryManager = new CategoryServices();

  try {
    // Attempt to create a new category using the provided data
    const response = await categoryManager.createOne(newCategory);

    // If the category is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Category created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during category creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the category in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};