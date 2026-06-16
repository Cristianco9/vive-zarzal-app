// Import the CategoryServices class from the categoryServices module
import { CategoryServices } from '../../services/categoryServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single category by ID.
 *
 * This function handles the request to find a specific category in the database
 * based on the provided ID. It calls the appropriate service method and returns
 * the category data if found. If an error occurs or the category is not found, it is handled
 * appropriately using Boom.
 *
 * @param {Object} req - The request object, expected to contain the category ID in the body.
 * @param {Object} res - The response object to send the category data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the category data or an error.
 */
export const listOneCategory = async (req, res, next) => {

  // Destructure the category ID from the request body
  const { id } = req.body;

  // Instantiate the CategoryServices class to manage category operations
  const categoryManager = new CategoryServices();

  try {
    // Attempt to find the category record by ID
    const record = await categoryManager.listOne(id);

    // If the category record is found, send a success response with the category data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'Category found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        category: record
      });
    }

  } catch (error) {
    // Handle errors during the category retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the category from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};