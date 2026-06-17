// Import the CategoryServices class from the categoryServices module
import { CategoryServices } from '../../services/categoryService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a category.
 *
 * This function handles the request to delete an existing category by extracting
 * the category ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the category ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneCategory = async (req, res, next) => {

  // Extract the category ID from the request body
  const { id } = req.body;

  // Instantiate the CategoryServices class to manage the category operations
  const categoryManager = new CategoryServices();

  try {
    // Attempt to delete the category by the provided ID
    const response = await categoryManager.deleteOne(id);

    // If the category is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Category deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during category deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the category from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};