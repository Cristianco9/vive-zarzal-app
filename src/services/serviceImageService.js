// import the service image data model
import { ServiceImage } from '../db/models/serviceImageModel.js';
// import the service model to validate the foreign key relation
import { Service } from '../db/models/serviceModel.js';
// import the business model to verify service ownership
import { Business } from '../db/models/businessModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "ServiceImage" entity.
 *
 * A service image stores an image URL and an optional description,
 * and is always tied to a service through "serviceId". This foreign
 * key is validated on every write operation to preserve referential
 * integrity.
 *
 * Association aliases (defined in setupAssociations):
 *   - service -> ServiceImage.belongsTo(Service)
 */
export class ServiceImageServices {

  /**
   * Creates a new image associated with an existing service.
   *
   * @param {Object} newServiceImage - Image data.
   * @param {string} newServiceImage.imageUrl - URL of the image (required).
   * @param {string} [newServiceImage.description] - Optional description.
   * @param {number} newServiceImage.serviceId - Parent service identifier.
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} NotFound if the service does not exist, internal error otherwise.
   */
  async createOne(newServiceImage) {

    try {
      // ensure the parent service exists before creating the image
      const parentService = await Service.findByPk(newServiceImage.serviceId);

      if (!parentService) {
        throw Boom.notFound('Parent service not found');
      }

      // create a new record in the database
      await ServiceImage.create({
        imageUrl: newServiceImage.imageUrl,
        description: newServiceImage.description,
        serviceId: newServiceImage.serviceId,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new service image' });
    }
  }

  /**
   * Updates an existing service image by its identifier, ensuring it belongs to the specified business.
   *
   * @param {number} serviceImageId - Identifier of the image to update.
   * @param {number} businessId - Identifier of the business that should own the service.
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async updateOne(serviceImageId, businessId, newData) {

    if (!newData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    if (!serviceImageId) {
      throw Boom.badRequest('No service image ID provided');
    }

    if (!businessId) {
      throw Boom.badRequest('No business ID provided');
    }

    try {
      // First verify that the service image exists and belongs to a service owned by the specified business
      const existingImage = await ServiceImage.findOne({
        where: { id: serviceImageId },
        include: [{
          model: Service,
          as: 'service',
          where: { businessId: businessId }
        }]
      });

      if (!existingImage) {
        throw Boom.notFound('Service image not found or does not belong to a service owned by the specified business');
      }

      // if the parent service is being changed, validate it exists and belongs to the business
      if (newData.serviceId) {
        const parentService = await Service.findOne({
          where: { id: newData.serviceId, businessId: businessId }
        });
        
        if (!parentService) {
          throw Boom.notFound('Parent service not found or does not belong to the specified business');
        }
      }

      // update the record in the database
      const [updatedRows] = await ServiceImage.update(
        {
          imageUrl: newData.imageUrl,
          description: newData.description,
          serviceId: newData.serviceId,
        },
        {
          where: { id: serviceImageId }
        }
      );

      // if no rows were affected, the image does not exist
      if (!updatedRows) {
        throw Boom.notFound('Service image not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update service image' });
    }
  }

  /**
   * Deletes a service image by its identifier, ensuring it belongs to the specified business.
   *
   * @param {number} serviceImageId - Identifier of the image to delete.
   * @param {number} businessId - Identifier of the business that should own the service.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async deleteOne(serviceImageId, businessId) {

    if (!serviceImageId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No service image ID provided');
    }

    if (!businessId) {
      throw Boom.badRequest('No business ID provided');
    }

    try {
      // First verify that the service image exists and belongs to a service owned by the specified business
      const existingImage = await ServiceImage.findOne({
        where: { id: serviceImageId },
        include: [{
          model: Service,
          as: 'service',
          where: { businessId: businessId }
        }]
      });

      if (!existingImage) {
        throw Boom.notFound('Service image not found or does not belong to a service owned by the specified business');
      }

      // destroy the record in the database
      const deletedRows = await ServiceImage.destroy({
        where: { id: serviceImageId }
      });

      // if no rows were deleted, the image does not exist
      if (!deletedRows) {
        throw Boom.notFound('Service image not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete service image' });
    }
  }

  /**
   * Retrieves a single service image, including its parent service.
   *
   * @param {number} serviceImageId - Identifier of the image.
   * @returns {Promise<Object>} The image record with its service.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async listOne(serviceImageId) {

    if (!serviceImageId) {
      throw Boom.badRequest('No service image ID provided');
    }

    try {
      const theServiceImage = await ServiceImage.findOne({
        where: { id: serviceImageId },
        include: [{ model: Service, as: 'service' }],
      });

      if (!theServiceImage) {
        throw Boom.notFound('Service image not found');
      }

      return theServiceImage;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find service image' });
    }
  }

  /**
   * Retrieves every service image ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of service images (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allServiceImages = await ServiceImage.findAll({
        order: [['id', 'ASC']],
        include: [{ model: Service, as: 'service' }],
      });

      // always return an array, even when there are no records
      return allServiceImages.length ? allServiceImages : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find service images' });
    }
  }
}