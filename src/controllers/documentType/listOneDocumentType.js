// Import the DocumentTypeServices class from the documentTypeServices module
import { DocumentTypeServices } from '../../services/documentTypeServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single document type by ID.
 *
 * This function handles the request to find a specific document type in the database
 * based on the provided ID. It calls the appropriate service method and returns
 * the document type data if found. If an error occurs or the record is not found, it is handled
 * appropriately using Boom.
 *
 * @param {Object} req - The request object, expected to contain the document type ID in the body.
 * @param {Object} res - The response object to send the document type data if found.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with the document type data or an error.
 */
export const listOneDocumentType = async (req, res, next) => {

  // Destructure the document type ID from the request body
  const { id } = req.body;

  // Instantiate the DocumentTypeServices class to manage document type operations
  const documentTypeManager = new DocumentTypeServices();

  try {
    // Attempt to find the document type record by ID
    const record = await documentTypeManager.listOne(id);

    // If the document type record is found, send a success response with the data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'Document type found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        documentType: record
      });
    }

  } catch (error) {
    // Handle errors during the retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the document type from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};