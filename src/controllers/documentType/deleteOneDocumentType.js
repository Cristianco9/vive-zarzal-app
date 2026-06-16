// Import the DocumentTypeServices class from the documentTypeServices module
import { DocumentTypeServices } from '../../services/documentTypeServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to delete a document type.
 *
 * This function handles the request to delete an existing document type by extracting
 * the document type ID from the request body, invoking the appropriate service method, and
 * returning a response based on the operation's success or failure.
 *
 * @param {Object} req - The request object containing the document type ID.
 * @param {Object} res - The response object to send the outcome of the operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the operation result.
 */
export const deleteOneDocumentType = async (req, res, next) => {

  // Extract the document type ID from the request body
  const { id } = req.body;

  // Instantiate the DocumentTypeServices class to manage the document type operations
  const documentTypeManager = new DocumentTypeServices();

  try {
    // Attempt to delete the document type by the provided ID
    const response = await documentTypeManager.deleteOne(id);

    // If the document type is deleted successfully, send a success response
    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Document type deleted successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during document type deletion by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to delete the document type from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};