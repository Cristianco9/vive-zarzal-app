// Import the RoleServices class from the roleServices module
import { RoleServices } from '../../services/roleServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single role by ID.
 *
 * This function handles the request to find a specific role in the database
 * based on the provided ID. It calls the appropriate service method and returns
 * the role data if found. If an error occurs or the record is not found, it is handled
 * appropriately using Boom.
 *
 * @param {Object} req - The request object, expected to contain the role ID in the body.
 * @param {Object} res - The response object to send the role data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the role data or an error.
 */
export const listOneRole = async (req, res, next) => {

  // Destructure the role ID from the request body
  const { id } = req.body;

  // Instantiate the RoleServices class to manage role operations
  const roleManager = new RoleServices();

  try {
    // Attempt to find the role record by ID
    const record = await roleManager.listOne(id);

    // If the role record is found, send a success response with the data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'Role found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        role: record
      });
    }

  } catch (error) {
    // Handle errors during the retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the role from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};