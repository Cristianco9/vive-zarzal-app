// Import the RoleServices class from the roleServices module
import { RoleServices } from '../../services/roleService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new role.
 *
 * This function handles the request to create a new role by extracting
 * the necessary data from the request body, invoking the appropriate service
 * method, and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the role's data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOneRole = async (req, res, next) => {

  // Extract the new role data from the request body
  const newRole = {
    name: req.body.newRoleData.name,
    description: req.body.newRoleData.description,
  };

  // Instantiate the RoleServices class to manage the role operations
  const roleManager = new RoleServices();

  try {
    // Attempt to create a new role using the provided data
    const response = await roleManager.createOne(newRole);

    // If the role is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Role created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during role creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the role in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};