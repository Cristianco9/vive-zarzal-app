// Import the DepartmentServices class from the departmentServices module
import { DepartmentServices } from '../../services/departmentServices.js';
// Import Boom to create HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to handle the update of a department.
 *
 * This function processes requests to update a department's details in the database. It accepts
 * the department ID and the new department data from the request body. If the update is successful,
 * it returns a success message. If there's an error, it handles the error appropriately.
 *
 * @param {Object} req - The request object, expected to contain the department ID and new department data in the body.
 * @param {Object} res - The response object to send the result of the update operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with a success message, or an error if the update fails.
 */
export const updateOneDepartment = async (req, res, next) => {

  // Extract department ID and new department data from the request body
  const { id, newDepartmentData } = req.body;

  // Instantiate the DepartmentServices class to manage department operations
  const departmentManager = new DepartmentServices();

  try {
    // Attempt to update the department details in the database
    const response = await departmentManager.updateOne(id, newDepartmentData);

    // If the update is successful, return a 201 response with a success message
    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Department updated successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during the update process by returning a 503 error
    const boomError = Boom.serverUnavailable(
      'Unable to update the department in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};