// import the document type data model
import { DocumentType } from '../db/models/documentTypeModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "DocumentType" catalog entity.
 *
 * Encapsulates all the business logic and database access related to the
 * identity document types a user can have. Every public method resolves
 * with the requested data or rejects with a normalized Boom error.
 */
export class DocumentTypeServices {

  /**
   * Creates a new document type record.
   *
   * @param {Object} newDocumentType - Data of the document type.
   * @param {string} newDocumentType.name - Unique name of the document type.
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} Conflict if it already exists, internal error otherwise.
   */
  async createOne(newDocumentType) {

    try {
      // check whether a document type with the same name already exists
      const existingDocumentType = await DocumentType.findOne({
        where: { name: newDocumentType.name }
      });

      // if it exists, reject the insertion to keep names unique
      if (existingDocumentType) {
        throw Boom.conflict('Document type already exists');
      }

      // create a new record in the database
      await DocumentType.create({
        name: newDocumentType.name,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new document type' });
    }
  }

  /**
   * Updates an existing document type by its identifier.
   *
   * @param {number} documentTypeId - Identifier of the record to update.
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest if no data is provided, NotFound if it does not exist.
   */
  async updateOne(documentTypeId, newData) {

    if (!newData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    try {
      // update the record in the database
      const [updatedRows] = await DocumentType.update(
        {
          name: newData.name,
        },
        {
          where: { id: documentTypeId }
        }
      );

      // if no rows were affected, the record does not exist
      if (!updatedRows) {
        throw Boom.notFound('Document type not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update document type' });
    }
  }

  /**
   * Deletes a document type by its identifier.
   *
   * @param {number} documentTypeId - Identifier of the record to delete.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async deleteOne(documentTypeId) {

    if (!documentTypeId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No document type ID provided');
    }

    try {
      // destroy the record in the database
      const deletedRows = await DocumentType.destroy({
        where: { id: documentTypeId }
      });

      // if no rows were deleted, the record does not exist
      if (!deletedRows) {
        throw Boom.notFound('Document type not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete document type' });
    }
  }

  /**
   * Retrieves a single document type by its identifier.
   *
   * @param {number} documentTypeId - Identifier of the record to find.
   * @returns {Promise<Object>} The document type record.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async listOne(documentTypeId) {

    if (!documentTypeId) {
      throw Boom.badRequest('No document type ID provided');
    }

    try {
      const theDocumentType = await DocumentType.findOne({
        where: { id: documentTypeId }
      });

      if (!theDocumentType) {
        throw Boom.notFound('Document type not found');
      }

      return theDocumentType;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find document type' });
    }
  }

  /**
   * Retrieves every document type ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of document types (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allDocumentTypes = await DocumentType.findAll({
        order: [['id', 'ASC']]
      });

      // always return an array, even when there are no records
      return allDocumentTypes.length ? allDocumentTypes : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find document types' });
    }
  }
}