// Import the CategoryServices class from the categoryServices module
import { CategoryServices } from '../../services/categoryServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all categories.
 *
 * This function handles the request to retrieve all categories from the database,
 * invoking the appropriate service method and returning a response with the list of categories.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of categories.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of categories.
 */
export const listAllCategories = async (req, res, next) => {

  // Instantiate the CategoryServices class to manage the category operations
  const categoryManager = new CategoryServices();

  try {
    // Attempt to retrieve all category records from the database
    const allRecords = await categoryManager.listAll();

    // If records are found, send a success response with the category data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Categories retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        categories: allRecords
      });
    }

  } catch (error) {
    // Handle errors during category retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve categories from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};