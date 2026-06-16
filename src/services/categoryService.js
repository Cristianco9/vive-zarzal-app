// import the category data model
import { Category } from '../db/models/categoryModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "Category" catalog entity.
 *
 * Encapsulates all the business logic and database access related to
 * the categories that classify services. Every public method resolves
 * with the requested data or rejects with a normalized Boom error.
 */
export class CategoryServices {

  /**
   * Creates a new category record.
   *
   * @param {Object} newCategory - Data of the category.
   * @param {string} newCategory.name - Unique name of the category.
   * @param {string} [newCategory.description] - Optional description.
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} Conflict if it already exists, internal error otherwise.
   */
  async createOne(newCategory) {

    try {
      // check whether a category with the same name already exists
      const existingCategory = await Category.findOne({
        where: { name: newCategory.name }
      });

      // if it exists, reject the insertion to keep names unique
      if (existingCategory) {
        throw Boom.conflict('Category already exists');
      }

      // create a new record in the database
      await Category.create({
        name: newCategory.name,
        description: newCategory.description,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new category' });
    }
  }

  /**
   * Updates an existing category by its identifier.
   *
   * @param {number} categoryId - Identifier of the record to update.
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest if no data is provided, NotFound if it does not exist.
   */
  async updateOne(categoryId, newData) {

    if (!newData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    try {
      // update the record in the database
      const [updatedRows] = await Category.update(
        {
          name: newData.name,
          description: newData.description,
        },
        {
          where: { id: categoryId }
        }
      );

      // if no rows were affected, the record does not exist
      if (!updatedRows) {
        throw Boom.notFound('Category not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update category' });
    }
  }

  /**
   * Deletes a category by its identifier.
   *
   * @param {number} categoryId - Identifier of the record to delete.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async deleteOne(categoryId) {

    if (!categoryId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No category ID provided');
    }

    try {
      // destroy the record in the database
      const deletedRows = await Category.destroy({
        where: { id: categoryId }
      });

      // if no rows were deleted, the record does not exist
      if (!deletedRows) {
        throw Boom.notFound('Category not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete category' });
    }
  }

  /**
   * Retrieves a single category by its identifier.
   *
   * @param {number} categoryId - Identifier of the record to find.
   * @returns {Promise<Object>} The category record.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async listOne(categoryId) {

    if (!categoryId) {
      throw Boom.badRequest('No category ID provided');
    }

    try {
      const theCategory = await Category.findOne({
        where: { id: categoryId }
      });

      if (!theCategory) {
        throw Boom.notFound('Category not found');
      }

      return theCategory;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find category' });
    }
  }

  /**
   * Retrieves every category ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of categories (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allCategories = await Category.findAll({
        order: [['id', 'ASC']]
      });

      // always return an array, even when there are no records
      return allCategories.length ? allCategories : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find categories' });
    }
  }
}