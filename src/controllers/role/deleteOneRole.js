// Import the RoleServices class from the roleServices module
import { RoleServices } from '../../services/roleService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a role.
 *
 * This function handles the request to delete an existing role by extracting
 * the role ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the role ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneRole = async (req, res, next) => {

  // Extract the role ID from the request body
  const { id } = req.body;

  // Instantiate the RoleServices class to manage the role operations
  const roleManager = new RoleServices();

  try {
    // Attempt to delete the role by the provided ID
    const response = await roleManager.deleteOne(id);

    // If the role is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Role deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during role deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the role from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};