// import the business review data model
import { BusinessReview } from '../db/models/businessReviewModel.js';
// import related models to validate foreign key relations
import { Business } from '../db/models/businessModel.js';
import { User } from '../db/models/userModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "BusinessReview" entity.
 *
 * A business review belongs to a business ("businessId") and the user who
 * wrote it ("userId"), both required. It carries an optional textual
 * content and an optional rating between 1 and 5. Both foreign keys are
 * validated on every write operation to preserve referential integrity.
 *
 * Association aliases (defined in setupAssociations):
 *   - business -> BusinessReview.belongsTo(Business)
 *   - user     -> BusinessReview.belongsTo(User)
 */
export class BusinessReviewServices {

  /**
   * Creates a new business review after validating its relations.
   *
   * @param {Object} newBusinessReview - Review data.
   * @param {number} newBusinessReview.businessId - Reviewed business identifier.
   * @param {number} newBusinessReview.userId - Author user identifier.
   * @param {string} [newBusinessReview.content] - Optional review content.
   * @param {number} [newBusinessReview.rating] - Optional rating (1 to 5).
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} NotFound if business/user do not exist, internal error otherwise.
   */
  async createOne(newBusinessReview) {

    try {
      // ensure the reviewed business exists
      const parentBusiness = await Business.findByPk(newBusinessReview.businessId);
      if (!parentBusiness) {
        throw Boom.notFound('Business not found');
      }

      // ensure the author user exists
      const authorUser = await User.findByPk(newBusinessReview.userId);
      if (!authorUser) {
        throw Boom.notFound('User not found');
      }

      // create a new record in the database
      await BusinessReview.create({
        businessId: newBusinessReview.businessId,
        userId: newBusinessReview.userId,
        content: newBusinessReview.content,
        rating: newBusinessReview.rating,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new business review' });
    }
  }

  /**
   * Updates an existing business review by its identifier.
   *
   * @param {number} businessReviewId - Identifier of the review to update.
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async updateOne(businessReviewId, newData) {

    if (!newData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    try {
      // validate the business relation only when it is being changed
      if (newData.businessId) {
        const parentBusiness = await Business.findByPk(newData.businessId);
        if (!parentBusiness) {
          throw Boom.notFound('Business not found');
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
      const [updatedRows] = await BusinessReview.update(
        {
          businessId: newData.businessId,
          userId: newData.userId,
          content: newData.content,
          rating: newData.rating,
        },
        {
          where: { id: businessReviewId }
        }
      );

      // if no rows were affected, the review does not exist
      if (!updatedRows) {
        throw Boom.notFound('Business review not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update business review' });
    }
  }

  /**
   * Deletes a business review by its identifier.
   *
   * @param {number} businessReviewId - Identifier of the review to delete.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async deleteOne(businessReviewId) {

    if (!businessReviewId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No business review ID provided');
    }

    try {
      // destroy the record in the database
      const deletedRows = await BusinessReview.destroy({
        where: { id: businessReviewId }
      });

      // if no rows were deleted, the review does not exist
      if (!deletedRows) {
        throw Boom.notFound('Business review not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete business review' });
    }
  }

  /**
   * Retrieves a single business review, including its business and author.
   *
   * @param {number} businessReviewId - Identifier of the review.
   * @returns {Promise<Object>} The review record with its relations.
   * @throws {Boom} BadRequest, NotFound or internal error.
   */
  async listOne(businessReviewId) {

    if (!businessReviewId) {
      throw Boom.badRequest('No business review ID provided');
    }

    try {
      const theBusinessReview = await BusinessReview.findOne({
        where: { id: businessReviewId },
        include: [
          { model: Business, as: 'business' },
          { model: User, as: 'user' },
        ],
      });

      if (!theBusinessReview) {
        throw Boom.notFound('Business review not found');
      }

      return theBusinessReview;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find business review' });
    }
  }

  /**
   * Retrieves every business review ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of business reviews (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allBusinessReviews = await BusinessReview.findAll({
        order: [['id', 'ASC']],
        include: [
          { model: Business, as: 'business' },
          { model: User, as: 'user' },
        ],
      });

      // always return an array, even when there are no records
      return allBusinessReviews.length ? allBusinessReviews : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find business reviews' });
    }
  }
}