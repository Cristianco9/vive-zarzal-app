// Import the DepartmentServices class from the departmentServices module
import { DepartmentServices } from '../../services/departmentServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all departments.
 *
 * This function handles the request to retrieve all departments from the database,
 * invoking the appropriate service method and returning a response with the list of departments.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of departments.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of departments.
 */
export const listAllDepartments = async (req, res, next) => {

  // Instantiate the DepartmentServices class to manage the department operations
  const departmentManager = new DepartmentServices();

  try {
    // Attempt to retrieve all department records from the database
    const allRecords = await departmentManager.listAll();

    // If records are found, send a success response with the department data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Departments retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        departments: allRecords
      });
    }

  } catch (error) {
    // Handle errors during department retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve departments from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};