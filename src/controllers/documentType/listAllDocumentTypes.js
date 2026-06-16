// Import the DocumentTypeServices class from the documentTypeServices module
import { DocumentTypeServices } from '../../services/documentTypeServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to list all document types.
 *
 * This function handles the request to retrieve all document types from the database,
 * invoking the appropriate service method and returning a response with the list of records.
 * If an error occurs during the operation, it is handled gracefully using Boom.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of document types.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the list of document types.
 */
export const listAllDocumentTypes = async (req, res, next) => {

  // Instantiate the DocumentTypeServices class to manage the document type operations
  const documentTypeManager = new DocumentTypeServices();

  try {
    // Attempt to retrieve all document type records from the database
    const allRecords = await documentTypeManager.listAll();

    // If records are found, send a success response with the data
    if (allRecords) {
      return res.status(201).json({
        success: true,
        message: 'Document types retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        documentTypes: allRecords
      });
    }

  } catch (error) {
    // Handle errors during document type retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve document types from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};