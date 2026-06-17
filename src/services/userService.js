// import the user data model
  import { User } from '../db/models/userModel.js';
  // import related catalog models to validate foreign key relations
  import { Role } from '../db/models/roleModel.js';
  import { Gender } from '../db/models/genderModel.js';
  import { DocumentType } from '../db/models/documentTypeModel.js';
  // import the user image model to expose the profile image relation
  import { UserImage } from '../db/models/userImageModel.js';
  // import the promise to encrypt the user's password
  import { hashPassword } from '../utils/auth/passwordHash.js';
  // import the module to sign a JWT
  import { signUserToken } from '../utils/auth/tokenSign.js';
  // bcrypt takes care of comparing the user's password
  import bcrypt from 'bcryptjs';
  // boom allows managing possible errors in a standardized way
  import Boom from '@hapi/boom';
  // import the configuration module
  import { config } from '../config/config.js';

  /**
   * Service layer for the "User" entity.
   *
   * A user belongs to a role ("roleId", required) and optionally to a gender
   * ("genderId") and a document type ("documentTypeId"). Email, username and
   * document number are unique. Passwords are always hashed before being
   * persisted and are excluded from every read response. Foreign keys are
   * validated on every write operation to preserve referential integrity.
   *
   * Association aliases (defined in setupAssociations):
   *   - role         -> User.belongsTo(Role)
   *   - gender       -> User.belongsTo(Gender)
   *   - documentType -> User.belongsTo(DocumentType)
   *   - profileImage -> User.hasMany(UserImage)
   */
  export class UserServices {

    /**
     * Builds the default include used to expose a user with its relations.
     * The password attribute is always excluded for security reasons.
     *
     * @returns {Object} Sequelize query options (attributes + include).
     */
    #publicQueryOptions() {
      return {
        attributes: { exclude: ['password'] },
        include: [
          { model: Role, as: 'role' },
          { model: Gender, as: 'gender' },
          { model: DocumentType, as: 'documentType' },
          { model: UserImage, as: 'profileImage' },
        ],
      };
    }

    /**
     * Authenticates a user by username and password.
     *
     * The issued JWT carries the user's role name (e.g. 'cliente',
     * 'anunciante', 'administrador') alongside their id, so that downstream
     * middlewares (checkRole) can authorize requests by role without an
     * extra database lookup on every request.
     *
     * @param {string} username - Username of the account.
     * @param {string} password - Plain-text password to verify.
     * @returns {Promise<Object>} Status object, including a JWT token on success.
     * @throws {Boom} Internal error if the verification fails unexpectedly.
     */
    async login(username, password) {

      try {
        // Find the user by their username in the database, including
        // their role so it can be embedded in the JWT payload
        const userRecord = await User.findOne({
          where: { username },
          include: [{ model: Role, as: 'role' }],
        });

        // if not found a user in the database
        if (!userRecord) {
          return { status: 'user not found' };
        }

        // Compare the provided password with the stored password hash
        const validPassword = await bcrypt.compare(password, userRecord.password);

        // If the password is not valid, reject the promise
        if (!validPassword) {
          return { status: 'wrong password' };
        }

        // Generate JWT token with user data, including the role name
        const userToken = signUserToken(
          { 
            id: userRecord.id, 
            role: userRecord.role.name,
            fullName: `${userRecord.firstName} ${userRecord.lastName}`
          },
          config.authAppJwtKey,
          '1h'
        );

        // Resolves the promise with the JWT token
        return { status: 'logged', token: userToken };

      } catch (error) {
        // Return a Boom error if there's an exception
        throw Boom.boomify(error, { message: 'Unable to verify user credentials' });
      }
    }

    /**
     * Creates a new user after validating relations, uniqueness and hashing
     * its password.
     *
     * @param {Object} newUser - User data.
     * @param {number} newUser.roleId - Role identifier (required).
     * @param {number} [newUser.genderId] - Optional gender identifier.
     * @param {number} [newUser.documentTypeId] - Optional document type identifier.
     * @param {string} newUser.firstName - User first name.
     * @param {string} newUser.lastName - User last name.
     * @param {string} [newUser.birthDate] - Optional birth date (YYYY-MM-DD).
     * @param {string} [newUser.documentNumber] - Optional unique document number.
     * @param {string} newUser.email - Unique email.
     * @param {string} newUser.username - Unique username.
     * @param {string} newUser.password - Plain-text password to be hashed.
     * @returns {Promise<Object>} Status object confirming the creation.
     * @throws {Boom} NotFound for missing relations, Conflict for duplicates.
     */
    async createOne(newUser) {

      try {
        // ensure the required role exists
        const userRole = await Role.findByPk(newUser.roleId);
        if (!userRole) {
          throw Boom.notFound('Role not found');
        }

        // validate the optional gender only when provided
        if (newUser.genderId) {
          const userGender = await Gender.findByPk(newUser.genderId);
          if (!userGender) {
            throw Boom.notFound('Gender not found');
          }
        }

        // validate the optional document type only when provided
        if (newUser.documentTypeId) {
          const userDocumentType = await DocumentType.findByPk(newUser.documentTypeId);
          if (!userDocumentType) {
            throw Boom.notFound('Document type not found');
          }
        }

        // ensure the email is not already registered
        const existingEmail = await User.findOne({ where: { email: newUser.email } });
        if (existingEmail) {
          throw Boom.conflict('Email already registered');
        }

        // ensure the username is not already taken
        const existingUsername = await User.findOne({ where: { username: newUser.username } });
        if (existingUsername) {
          throw Boom.conflict('Username already taken');
        }

        // ensure the document number, when provided, is unique
        if (newUser.documentNumber) {
          const existingDocument = await User.findOne({
            where: { documentNumber: newUser.documentNumber }
          });
          if (existingDocument) {
            throw Boom.conflict('Document number already registered');
          }
        }

        // hash the password before storing it
        const hash = await hashPassword(newUser.password);

        // create a new record in the database
        await User.create({
          roleId: newUser.roleId,
          genderId: newUser.genderId,
          documentTypeId: newUser.documentTypeId,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          birthDate: newUser.birthDate,
          documentNumber: newUser.documentNumber,
          email: newUser.email,
          username: newUser.username,
          password: hash,
        });

        // return a success response
        return { status: 'CREATED SUCCESSFULLY' };

      } catch (error) {
        // preserve Boom errors, wrap any unexpected one
        if (Boom.isBoom(error)) throw error;
        throw Boom.boomify(error, { message: 'Unable to create new user' });
      }
    }

    /**
     * Updates an existing user by its identifier. If a new password is
     * provided it is re-hashed before being persisted.
     *
     * @param {number} userId - Identifier of the user to update.
     * @param {Object} newData - New values to persist.
     * @returns {Promise<Object>} Status object confirming the update.
     * @throws {Boom} BadRequest, NotFound, Conflict or internal error.
     */
    async updateOne(userId, newData) {

      if (!newData) {
        // reject the request when there is no payload to apply
        throw Boom.badRequest('No data provided');
      }

      try {
        // validate the role relation only when it is being changed
        if (newData.roleId) {
          const userRole = await Role.findByPk(newData.roleId);
          if (!userRole) {
            throw Boom.notFound('Role not found');
          }
        }

        // validate the gender relation only when it is being changed
        if (newData.genderId) {
          const userGender = await Gender.findByPk(newData.genderId);
          if (!userGender) {
            throw Boom.notFound('Gender not found');
          }
        }

        // validate the document type relation only when it is being changed
        if (newData.documentTypeId) {
          const userDocumentType = await DocumentType.findByPk(newData.documentTypeId);
          if (!userDocumentType) {
            throw Boom.notFound('Document type not found');
          }
        }

        // hash the new password if one was supplied
        const dataToUpdate = { ...newData };
        if (newData.password) {
          dataToUpdate.password = await hashPassword(newData.password);
        }

        // update the record in the database
        const [updatedRows] = await User.update(dataToUpdate, {
          where: { id: userId }
        });

        // if no rows were affected, the user does not exist
        if (!updatedRows) {
          throw Boom.notFound('User not found');
        }

        // return a success response
        return { status: 'UPDATED SUCCESSFULLY' };

      } catch (error) {
        if (Boom.isBoom(error)) throw error;
        throw Boom.boomify(error, { message: 'Unable to update user' });
      }
    }

    /**
     * Deletes a user by its identifier.
     *
     * @param {number} userId - Identifier of the user to delete.
     * @returns {Promise<Object>} Status object confirming the deletion.
     * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
     */
    async deleteOne(userId) {

      if (!userId) {
        // an identifier is mandatory to perform a deletion
        throw Boom.badRequest('No user ID provided');
      }

      try {
        // destroy the record in the database
        const deletedRows = await User.destroy({
          where: { id: userId }
        });

        // if no rows were deleted, the user does not exist
        if (!deletedRows) {
          throw Boom.notFound('User not found');
        }

        // return a success response
        return { status: 'DELETED SUCCESSFULLY' };

      } catch (error) {
        if (Boom.isBoom(error)) throw error;
        throw Boom.boomify(error, { message: 'Unable to delete user' });
      }
    }

    /**
       * Allows a user to delete their own account by verifying their user ID.
       *
       * @param {number} userId - Identifier of the authenticated user.
       * @returns {Promise<Object>} Status object confirming the deletion.
       * @throws {Boom} BadRequest if no id is provided, NotFound if it does not exist.
       */
    async deleteOwnAccount(userId) {

      if (!userId) {
        // an identifier is mandatory to perform a deletion
        throw Boom.badRequest('No user ID provided');
      }

      try {
        // destroy the record in the database for the authenticated user
        const deletedRows = await User.destroy({
          where: { id: userId }
        });

        // if no rows were deleted, the user does not exist
        if (!deletedRows) {
          throw Boom.notFound('User not found');
        }

        // return a success response
        return { status: 'ACCOUNT DELETED SUCCESSFULLY' };

      } catch (error) {
        if (Boom.isBoom(error)) throw error;
        throw Boom.boomify(error, { message: 'Unable to delete your account' });
      }
    }

    /**
     * Retrieves a single user (without the password) and its relations.
     *
     * @param {number} userId - Identifier of the user.
     * @returns {Promise<Object>} The user record with its relations.
     * @throws {Boom} BadRequest, NotFound or internal error.
     */
    async listOne(userId) {

      if (!userId) {
        throw Boom.badRequest('No user ID provided');
      }

      try {
        const theUser = await User.findOne({
          where: { id: userId },
          ...this.#publicQueryOptions(),
        });

        if (!theUser) {
          throw Boom.notFound('User not found');
        }

        return theUser;

      } catch (error) {
        if (Boom.isBoom(error)) throw error;
        throw Boom.boomify(error, { message: 'Unable to find user' });
      }
    }

    /**
     * Retrieves every user (without passwords) ordered by id ascending.
     *
     * @returns {Promise<Object[]>} List of users (empty array if none).
     * @throws {Boom} Internal error if the query fails.
     */
    async listAll() {

      try {
        const allUsers = await User.findAll({
          order: [['id', 'ASC']],
          ...this.#publicQueryOptions(),
        });

        // always return an array, even when there are no records
        return allUsers.length ? allUsers : [];

      } catch (error) {
        throw Boom.boomify(error, { message: 'Unable to find users' });
      }
    }

    /**
     * Recovers (resets) a user's password identified by email.
     *
     * Locates the user by email, hashes the new password and persists it.
     *
     * @param {string} email - Email of the account to recover.
     * @param {string} newPassword - New plain-text password to be hashed.
     * @returns {Promise<Object>} Status object confirming the password change.
     * @throws {Boom} BadRequest, NotFound or internal error.
     */
    async recoverPassword(email, newPassword) {

      if (!email || !newPassword) {
        throw Boom.badRequest('Email and new password are required');
      }

      try {
        // find the user by their email
        const userRecord = await User.findOne({ where: { email } });

        // if no user was found
        if (!userRecord) {
          throw Boom.notFound('User not found');
        }

        // hash the new password before storing it
        const hash = await hashPassword(newPassword);

        // persist the new password
        await User.update(
          { password: hash },
          { where: { id: userRecord.id } }
        );

        // return a success response
        return { status: 'PASSWORD UPDATED SUCCESSFULLY' };

      } catch (error) {
        if (Boom.isBoom(error)) throw error;
        throw Boom.boomify(error, { message: 'Unable to recover password' });
      }
    }

    /**
     * Finds a user by email INCLUDING the password hash. Intended for the
     * authentication layer only, never to be exposed through the API.
     *
     * @param {string} email - Email to search for.
     * @returns {Promise<Object|null>} The user with its password, or null.
     * @throws {Boom} BadRequest if no email is provided, internal error otherwise.
     */
    async findByEmailForAuth(email) {

      if (!email) {
        throw Boom.badRequest('No email provided');
      }

      try {
        // password is intentionally included here for credential verification
        return await User.findOne({
          where: { email },
          include: [{ model: Role, as: 'role' }],
        });

      } catch (error) {
        throw Boom.boomify(error, { message: 'Unable to find user by email' });
      }
    }
  }