// Import the RoleServices class from the roleServices module
import { RoleServices } from '../../services/roleService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all roles.
 *
 * This function handles the request to retrieve all roles from the database,
 * invoking the appropriate service method and returning a response with the list of records.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of roles.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of roles.
 */
export const listAllRoles = async (req, res, next) => {

  // Instantiate the RoleServices class to manage the role operations
  const roleManager = new RoleServices();

  try {
    // Attempt to retrieve all role records from the database
    const allRecords = await roleManager.listAll();

    // If records are found, send a success response with the data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Roles retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        roles: allRecords
      });
    }

  } catch (error) {
    // Handle errors during role retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve roles from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};