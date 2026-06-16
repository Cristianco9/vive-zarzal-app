// import the service data model
import { Service } from '../db/models/serviceModel.js';
// import related models to validate foreign key relations
import { Category } from '../db/models/categoryModel.js';
import { ServiceStatus } from '../db/models/serviceStatusModel.js';
import { AgeRestriction } from '../db/models/ageRestrictionModel.js';
import { Business } from '../db/models/businessModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "Service" entity.
 *
 * A service belongs to a category, a status and a business (all required),
 * and may optionally reference an age restriction. Every related foreign
 * key is validated on write operations to preserve referential integrity.
 *
 * Association aliases (defined in setupAssociations):
 *   - category        -> Service.belongsTo(Category)
 *   - status          -> Service.belongsTo(ServiceStatus)
 *   - ageRestriction  -> Service.belongsTo(AgeRestriction)
 *   - business        -> Service.belongsTo(Business)
 */
export class ServiceServices {

  /**
   * Creates a new service after validating all of its relations.
   *
   * @param {Object} newService - Service data.
   * @param {string} newService.name - Service name.
   * @param {string} [newService.description] - Optional description.
   * @param {number} newService.price - Service price (>= 0).
   * @param {number} newService.categoryId - Category identifier (required).
   * @param {number} newService.statusId - Service status identifier (required).
   * @param {number} [newService.ageRestrictionId] - Optional age restriction id.
   * @param {number} newService.businessId - Business identifier (required).
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} NotFound if a relation does not exist, internal error otherwise.
   */
  async createOne(newService) {

    try {
      // validate the required relations exist before creating the service
      const parentCategory = await Category.findByPk(newService.categoryId);
      if (!parentCategory) {
        throw Boom.notFound('Category not found');
      }

      const parentStatus = await ServiceStatus.findByPk(newService.statusId);
      if (!parentStatus) {
        throw Boom.notFound('Service status not found');
      }

      const parentBusiness = await Business.findByPk(newService.businessId);
      if (!parentBusiness) {
        throw Boom.notFound('Business not found');
      }

      // validate the optional age restriction only when provided
      if (newService.ageRestrictionId) {
        const parentAgeRestriction = await AgeRestriction.findByPk(newService.ageRestrictionId);
        if (!parentAgeRestriction) {
          throw Boom.notFound('Age restriction not found');
        }
      }

      // create a new record in the database
      await Service.create({
        name: newService.name,
        description: newService.description,
        price: newService.price,
        categoryId: newService.categoryId,
        statusId: newService.statusId,
        ageRestrictionId: newService.ageRestrictionId,
        businessId: newService.businessId,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new service' });
    }
  }

  /**
   * Updates an existing service by its identifier, ensuring it belongs to the specified business.
   *
   * @param {number} serviceId - Identifier of the service to update.
   * @param {number} businessId - Identifier of the business that should own the service.
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async updateOne(serviceId, businessId, newData) {

    if (!newData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    if (!serviceId) {
      throw Boom.badRequest('No service ID provided');
    }

    if (!businessId) {
      throw Boom.badRequest('No business ID provided');
    }

    try {
      // First verify that the service exists and belongs to the specified business
      const existingService = await Service.findOne({
        where: { id: serviceId, businessId: businessId }
      });

      if (!existingService) {
        throw Boom.notFound('Service not found or does not belong to the specified business');
      }

      // validate any relation that is being changed
      if (newData.categoryId) {
        const parentCategory = await Category.findByPk(newData.categoryId);
        if (!parentCategory) {
          throw Boom.notFound('Category not found');
        }
      }

      if (newData.statusId) {
        const parentStatus = await ServiceStatus.findByPk(newData.statusId);
        if (!parentStatus) {
          throw Boom.notFound('Service status not found');
        }
      }

      if (newData.businessId) {
        const parentBusiness = await Business.findByPk(newData.businessId);
        if (!parentBusiness) {
          throw Boom.notFound('Business not found');
        }
      }

      if (newData.ageRestrictionId) {
        const parentAgeRestriction = await AgeRestriction.findByPk(newData.ageRestrictionId);
        if (!parentAgeRestriction) {
          throw Boom.notFound('Age restriction not found');
        }
      }

      // update the record in the database
      const [updatedRows] = await Service.update(
        {
          name: newData.name,
          description: newData.description,
          price: newData.price,
          categoryId: newData.categoryId,
          statusId: newData.statusId,
          ageRestrictionId: newData.ageRestrictionId,
          businessId: newData.businessId,
        },
        {
          where: { id: serviceId, businessId: businessId }
        }
      );

      // if no rows were affected, the service does not exist or doesn't belong to the business
      if (!updatedRows) {
        throw Boom.notFound('Service not found or does not belong to the specified business');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update service' });
    }
  }

  /**
   * Deletes a service by its identifier, ensuring it belongs to the specified business.
   *
   * @param {number} serviceId - Identifier of the service to delete.
   * @param {number} businessId - Identifier of the business that should own the service.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async deleteOne(serviceId, businessId) {

    if (!serviceId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No service ID provided');
    }

    if (!businessId) {
      throw Boom.badRequest('No business ID provided');
    }

    try {
      // First verify that the service exists and belongs to the specified business
      const existingService = await Service.findOne({
        where: { id: serviceId, businessId: businessId }
      });

      if (!existingService) {
        throw Boom.notFound('Service not found or does not belong to the specified business');
      }

      // destroy the record in the database
      const deletedRows = await Service.destroy({
        where: { id: serviceId, businessId: businessId }
      });

      // if no rows were deleted, the service does not exist or doesn't belong to the business
      if (!deletedRows) {
        throw Boom.notFound('Service not found or does not belong to the specified business');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete service' });
    }
  }

  /**
   * Retrieves a single service, including its related entities.
   *
   * @param {number} serviceId - Identifier of the service.
   * @returns {Promise<Object>} The service record with its relations.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async listOne(serviceId) {

    if (!serviceId) {
      throw Boom.badRequest('No service ID provided');
    }

    try {
      const theService = await Service.findOne({
        where: { id: serviceId },
        include: [
          { model: Category, as: 'category' },
          { model: ServiceStatus, as: 'status' },
          { model: AgeRestriction, as: 'ageRestriction' },
          { model: Business, as: 'business' },
        ],
      });

      if (!theService) {
        throw Boom.notFound('Service not found');
      }

      return theService;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find service' });
    }
  }

  /**
   * Retrieves every service ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of services (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allServices = await Service.findAll({
        order: [['id', 'ASC']],
        include: [
          { model: Category, as: 'category' },
          { model: ServiceStatus, as: 'status' },
          { model: AgeRestriction, as: 'ageRestriction' },
          { model: Business, as: 'business' },
        ],
      });

      // always return an array, even when there are no records
      return allServices.length ? allServices : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find services' });
    }
  }

  /**
   * Retrieves all services that belong to a specific business.
   *
   * @param {number} businessId - Identifier of the business.
   * @returns {Promise<Object[]>} List of services belonging to the business.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async listByBusinessId(businessId) {
    if (!businessId) {
      throw Boom.badRequest('No business ID provided');
    }

    try {
      // Verificar si el negocio existe
      const business = await Business.findByPk(businessId);
      if (!business) {
        throw Boom.notFound('Business not found');
      }

      // Obtener todos los servicios asociados al negocio
      const services = await Service.findAll({
        where: { businessId },
        order: [['id', 'ASC']],
        include: [
          { model: Category, as: 'category' },
          { model: ServiceStatus, as: 'status' },
          { model: AgeRestriction, as: 'ageRestriction' },
          { model: Business, as: 'business' },
        ],
      });

      return services.length ? services : [];
    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find services for the business' });
    }
  }
}