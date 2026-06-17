// Import the DocumentTypeServices class from the documentTypeServices module
import { DocumentTypeServices } from '../../services/documentTypeService.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to create a new document type.
 *
 * This function handles the request to create a new document type by extracting
 * the necessary data from the request body, invoking the appropriate service
 * method, and returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the document type's data.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const createOneDocumentType = async (req, res, next) => {

  // Extract the new document type data from the request body
  const newDocumentType = {
    name: req.body.newDocumentTypeData.name,
  };

  // Instantiate the DocumentTypeServices class to manage the document type operations
  const documentTypeManager = new DocumentTypeServices();

  try {
    // Attempt to create a new document type using the provided data
    const response = await documentTypeManager.createOne(newDocumentType);

    // If the document type is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Document type created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during document type creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the document type in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};