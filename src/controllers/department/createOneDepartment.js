// Import the DepartmentServices class from the departmentServices module
import { DepartmentServices } from '../../services/departmentServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new department.
 *
 * This function handles the request to create a new department by extracting
 * the necessary data from the request body, invoking the appropriate service
 * method, and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the department's data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOneDepartment = async (req, res, next) => {

  // Extract the new department data from the request body
  const newDepartment = {
    name: req.body.newDepartmentData.name,
    description: req.body.newDepartmentData.description,
    countryId: req.body.newDepartmentData.countryId,
  };

  // Instantiate the DepartmentServices class to manage the department operations
  const departmentManager = new DepartmentServices();

  try {
    // Attempt to create a new department using the provided data
    const response = await departmentManager.createOne(newDepartment);

    // If the department is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Department created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during department creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the department in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};