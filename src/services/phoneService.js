// import the phone data model
import { Phone } from '../db/models/phoneModel.js';
// import the user and business models to resolve their related phones
import { User } from '../db/models/userModel.js';
import { Business } from '../db/models/businessModel.js';
// boom allows managing possible errors in a standardized way
import Boom from '@hapi/boom';

/**
 * Service layer for the "Phone" entity.
 *
 * Stores phone numbers that are later linked to businesses through the
 * BusinessPhone junction table and to users through the UserPhone junction
 * table. Every public method resolves with the requested data or rejects
 * with a normalized Boom error.
 */
export class PhoneServices {

  /**
   * Creates a new phone record.
   *
   * @param {Object} newPhone - Data of the phone.
   * @param {string} newPhone.phoneNumber - Phone number (required).
   * @returns {Promise<Object>} Status object confirming the creation.
   * @throws {Boom} Conflict if it already exists, internal error otherwise.
   */
  async createOne(newPhone) {

    try {
      // check whether the same phone number already exists
      const existingPhone = await Phone.findOne({
        where: { phoneNumber: newPhone.phoneNumber }
      });

      // if it exists, reject the insertion to avoid duplicates
      if (existingPhone) {
        throw Boom.conflict('Phone number already exists');
      }

      // create a new record in the database
      await Phone.create({
        phoneNumber: newPhone.phoneNumber,
      });

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };

    } catch (error) {
      // preserve Boom errors, wrap any unexpected one
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to create new phone' });
    }
  }

  /**
   * Updates an existing phone by its identifier.
   *
   * @param {number} phoneId - Identifier of the record to update.
   * @param {Object} newData - New values to persist.
   * @returns {Promise<Object>} Status object confirming the update.
   * @throws {Boom} BadRequest if no data is provided, NotFound if it does not exist.
   */
  async updateOne(phoneId, newData) {

    if (!newData) {
      // reject the request when there is no payload to apply
      throw Boom.badRequest('No data provided');
    }

    try {
      // update the record in the database
      const [updatedRows] = await Phone.update(
        {
          phoneNumber: newData.phoneNumber,
        },
        {
          where: { id: phoneId }
        }
      );

      // if no rows were affected, the record does not exist
      if (!updatedRows) {
        throw Boom.notFound('Phone not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to update phone' });
    }
  }

  /**
   * Deletes a phone by its identifier.
   *
   * @param {number} phoneId - Identifier of the record to delete.
   * @returns {Promise<Object>} Status object confirming the deletion.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async deleteOne(phoneId) {

    if (!phoneId) {
      // an identifier is mandatory to perform a deletion
      throw Boom.badRequest('No phone ID provided');
    }

    try {
      // destroy the record in the database
      const deletedRows = await Phone.destroy({
        where: { id: phoneId }
      });

      // if no rows were deleted, the record does not exist
      if (!deletedRows) {
        throw Boom.notFound('Phone not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to delete phone' });
    }
  }

  /**
   * Retrieves a single phone by its identifier.
   *
   * @param {number} phoneId - Identifier of the record to find.
   * @returns {Promise<Object>} The phone record.
   * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
   */
  async listOne(phoneId) {

    if (!phoneId) {
      throw Boom.badRequest('No phone ID provided');
    }

    try {
      const thePhone = await Phone.findOne({
        where: { id: phoneId }
      });

      if (!thePhone) {
        throw Boom.notFound('Phone not found');
      }

      return thePhone;

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find phone' });
    }
  }

  /**
   * Retrieves every phone ordered by id ascending.
   *
   * @returns {Promise<Object[]>} List of phones (empty array if none).
   * @throws {Boom} Internal error if the query fails.
   */
  async listAll() {

    try {
      const allPhones = await Phone.findAll({
        order: [['id', 'ASC']]
      });

      // always return an array, even when there are no records
      return allPhones.length ? allPhones : [];

    } catch (error) {
      throw Boom.boomify(error, { message: 'Unable to find phones' });
    }
  }

  /**
   * Retrieves all phones related to a given user, considering BOTH sources:
   *   1. Personal phones the user owns directly  (User ↔ Phone via UserPhone).
   *   2. Phones of the business the user owns     (Business ↔ Phone via BusinessPhone).
   *
   * This reflects the application context where a person (client) can have
   * their own phone numbers and, if they are also a business owner, the
   * business has its own phone numbers as well.
   *
   * @param {number} userId - Identifier of the user.
   * @returns {Promise<Object>} Object grouping personal, business and combined phones.
   * @throws {Boom} BadRequest if no id is provided, NotFound if the user does not exist.
   */
  async listAllByUser(userId) {

    if (!userId) {
      // an identifier is mandatory to resolve the related phones
      throw Boom.badRequest('No user ID provided');
    }

    try {
      // fetch the user together with their personal phones and, if any,
      // the business they own along with its phones
      const theUser = await User.findOne({
        where: { id: userId },
        include: [
          {
            // personal phones (User ↔ Phone via UserPhone)
            model: Phone,
            as: 'phones',
            through: { attributes: [] }, // omit junction table columns
          },
          {
            // business owned by the user (may be null) and its phones
            model: Business,
            as: 'businesses',
            include: [
              {
                model: Phone,
                as: 'phones',
                through: { attributes: [] },
              },
            ],
          },
        ],
        order: [['id', 'ASC']],
      });

      // if the user does not exist, report it
      if (!theUser) {
        throw Boom.notFound('User not found');
      }

      // personal phones of the user (client)
      const personalPhones = theUser.phones || [];

      // phones belonging to the user's business (if the user owns one)
      const businessPhones = theUser.businesses?.phones || [];

      // merge both lists removing duplicates by phone id
      const phonesById = new Map();
      [...personalPhones, ...businessPhones].forEach((phone) => {
        phonesById.set(phone.id, phone);
      });
      const allPhones = Array.from(phonesById.values())
        .sort((a, b) => a.id - b.id);

      // return the phones grouped by source plus a combined, de-duplicated list
      return {
        userId,
        personalPhones,
        businessPhones,
        allPhones,
      };

    } catch (error) {
      if (Boom.isBoom(error)) throw error;
      throw Boom.boomify(error, { message: 'Unable to find phones for user' });
    }
  }
}