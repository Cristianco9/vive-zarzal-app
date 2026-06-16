// Import the DocumentTypeServices class from the documentTypeServices module
import { DocumentTypeServices } from '../../services/documentTypeServices.js';
// Import Boom to create HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to handle the update of a document type.
 *
 * This function processes requests to update a document type's details in the database. It accepts
 * the document type ID and the new data from the request body. If the update is successful,
 * it returns a success message. If there's an error, it handles the error appropriately.
 *
 * @param {Object} req - The request object, expected to contain the document type ID and new data in the body.
 * @param {Object} res - The response object to send the result of the update operation.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Returns a JSON response with a success message, or an error if the update fails.
 */
export const updateOneDocumentType = async (req, res, next) => {

  // Extract document type ID and new document type data from the request body
  const { id, newDocumentTypeData } = req.body;

  // Instantiate the DocumentTypeServices class to manage document type operations
  const documentTypeManager = new DocumentTypeServices();

  try {
    // Attempt to update the document type details in the database
    const response = await documentTypeManager.updateOne(id, newDocumentTypeData);

    // If the update is successful, return a 201 response with a success message
    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Document type updated successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (error) {
    // Handle errors during the update process by returning a 503 error
    const boomError = Boom.serverUnavailable(
      'Unable to update the document type in the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};