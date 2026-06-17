// Import the CategoryServices class from the categoryServices module
import { CategoryServices } from '../../services/categoryService.js';
// Import Boom to create HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to handle the update of a category.
 *
 * This function processes requests to update a category's details in the database. It accepts
 * the category ID and the new category data from the request body. If the update is successful,
 * it returns a success message. If there's an error, it handles the error appropriately.
 *
 * @param {Object} req - The request object, expected to contain the category ID and new category data in the body.
 * @param {Object} res - The response object to send the result of the update operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with a success message, or an error if the update fails.
 */
export const updateOneCategory = async (req, res, next) => {

  // Extract category ID and new category data from the request body
  const { id, newCategoryData } = req.body;

  // Instantiate the CategoryServices class to manage category operations
  const categoryManager = new CategoryServices();

  try {
    // Attempt to update the category details in the database
    const response = await categoryManager.updateOne(id, newCategoryData);

    // If the update is successful, return a 201 response with a success message
    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Category updated successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during the update process by returning a 503 error
    const boomError = Boom.serverUnavailable(
      'Unable to update the category in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};