// Import the DepartmentServices class from the departmentServices module
import { DepartmentServices } from '../../services/departmentService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a department.
 *
 * This function handles the request to delete an existing department by extracting
 * the department ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the department ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneDepartment = async (req, res, next) => {

  // Extract the department ID from the request body
  const { id } = req.body;

  // Instantiate the DepartmentServices class to manage the department operations
  const departmentManager = new DepartmentServices();

  try {
    // Attempt to delete the department by the provided ID
    const response = await departmentManager.deleteOne(id);

    // If the department is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Department deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during department deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the department from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};