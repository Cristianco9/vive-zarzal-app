// Import the RoleServices class from the roleServices module
import { RoleServices } from '../../services/roleService.js';
// Import Boom to create HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to handle the update of a role.
 *
 * This function processes requests to update a role's details in the database. It accepts
 * the role ID and the new data from the request body. If the update is successful,
 * it returns a success message. If there's an error, it handles the error appropriately.
 *
 * @param {Object} req - The request object, expected to contain the role ID and new data in the body.
 * @param {Object} res - The response object to send the result of the update operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with a success message, or an error if the update fails.
 */
export const updateOneRole = async (req, res, next) => {

  // Extract role ID and new role data from the request body
  const { id, newRoleData } = req.body;

  // Instantiate the RoleServices class to manage role operations
  const roleManager = new RoleServices();

  try {
    // Attempt to update the role details in the database
    const response = await roleManager.updateOne(id, newRoleData);

    // If the update is successful, return a 201 response with a success message
    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Role updated successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during the update process by returning a 503 error
    const boomError = Boom.serverUnavailable(
      'Unable to update the role in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};