// import the service review data model
import { ServiceReview } from '../db/models/serviceReviewModel.js';
// import related models to validate foreign key relations
import { Service } from '../db/models/serviceModel.js';
import { User } from '../db/models/userModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "ServiceReview" entity.
 *
 * A service review belongs to a service ("serviceId") and the user who
 * wrote it ("userId"), both required. It carries an optional textual
 * content and an optional rating between 1 and 5. Both foreign keys are
 * validated on every write operation to preserve referential integrity.
 *
 * Association aliases (defined in setupAssociations):
 *   - service -> ServiceReview.belongsTo(Service)
 *   - user    -> ServiceReview.belongsTo(User)
 */
export class ServiceReviewServices {

  /**
   * Creates a new service review after validating its relations.
   *
   * @param {Object} newServiceReview - Review data.
   * @param {number} newServiceReview.serviceId - Reviewed service identifier.
   * @param {number} newServiceReview.userId - Author user identifier.
   * @param {string} [newServiceReview.content] - Optional review content.
   * @param {number} [newServiceReview.rating] - Optional rating (1 to 5).
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} NotFound if service/user do not exist, internal error otherwise.
   */
  async createOne(newServiceReview) {

    try {
      // ensure the reviewed service exists
      const parentService = await Service.findByPk(newServiceReview.serviceId);
      if (!parentService) {
        throw Boom.notFound('Service not found');
      }

      // ensure the author user exists
      const authorUser = await User.findByPk(newServiceReview.userId);
      if (!authorUser) {
        throw Boom.notFound('User not found');
      }

      // create a new record in the database
      await ServiceReview.create({
        serviceId: newServiceReview.serviceId,
        userId: newServiceReview.userId,
        content: newServiceReview.content,
        rating: newServiceReview.rating,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new service review' });
    }
  }

  /**
   * Updates an existing service review by its identifier.
   *
   * @param {number} serviceReviewId - Identifier of the review to update.
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async updateOne(serviceReviewId, newData) {

    if (!newData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    try {
      // validate the service relation only when it is being changed
      if (newData.serviceId) {
        const parentService = await Service.findByPk(newData.serviceId);
        if (!parentService) {
          throw Boom.notFound('Service not found');
        }
      }

      // validate the user relation only when it is being changed
      if (newData.userId) {
        const authorUser = await User.findByPk(newData.userId);
        if (!authorUser) {
          throw Boom.notFound('User not found');
        }
      }

      // update the record in the database
      const [updatedRows] = await ServiceReview.update(
        {
          serviceId: newData.serviceId,
          userId: newData.userId,
          content: newData.content,
          rating: newData.rating,
        },
        {
          where: { id: serviceReviewId }
        }
      );

      // if no rows were affected, the review does not exist
      if (!updatedRows) {
        throw Boom.notFound('Service review not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update service review' });
    }
  }

  /**
   * Deletes a service review by its identifier.
   *
   * @param {number} serviceReviewId - Identifier of the review to delete.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async deleteOne(serviceReviewId) {

    if (!serviceReviewId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No service review ID provided');
    }

    try {
      // destroy the record in the database
      const deletedRows = await ServiceReview.destroy({
        where: { id: serviceReviewId }
      });

      // if no rows were deleted, the review does not exist
      if (!deletedRows) {
        throw Boom.notFound('Service review not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete service review' });
    }
  }

  /**
   * Retrieves a single service review, including its service and author.
   *
   * @param {number} serviceReviewId - Identifier of the review.
   * @returns {Promise<Object>} The review record with its relations.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async listOne(serviceReviewId) {

    if (!serviceReviewId) {
      throw Boom.badRequest('No service review ID provided');
    }

    try {
      const theServiceReview = await ServiceReview.findOne({
        where: { id: serviceReviewId },
        include: [
          { model: Service, as: 'service' },
          { model: User, as: 'user' },
        ],
      });

      if (!theServiceReview) {
        throw Boom.notFound('Service review not found');
      }

      return theServiceReview;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find service review' });
    }
  }

  /**
   * Retrieves every service review ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of service reviews (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allServiceReviews = await ServiceReview.findAll({
        order: [['id', 'ASC']],
        include: [
          { model: Service, as: 'service' },
          { model: User, as: 'user' },
        ],
      });

      // always return an array, even when there are no records
      return allServiceReviews.length ? allServiceReviews : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find service reviews' });
    }
  }
}