// Import the DepartmentServices class from the departmentServices module
import { DepartmentServices } from '../../services/departmentServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single department by ID.
 *
 * This function handles the request to find a specific department in the database
 * based on the provided ID. It calls the appropriate service method and returns
 * the department data if found. If an error occurs or the department is not found, it is handled
 * appropriately using Boom.
 *
 * @param {Object} req - The request object, expected to contain the department ID in the body.
 * @param {Object} res - The response object to send the department data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the department data or an error.
 */
export const listOneDepartment = async (req, res, next) => {

  // Destructure the department ID from the request body
  const { id } = req.body;

  // Instantiate the DepartmentServices class to manage department operations
  const departmentManager = new DepartmentServices();

  try {
    // Attempt to find the department record by ID
    const record = await departmentManager.listOne(id);

    // If the department record is found, send a success response with the department data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'Department found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        department: record
      });
    }

  } catch (error) {
    // Handle errors during the department retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the department from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};