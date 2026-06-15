// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';

// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the user phones table
export const USER_PHONE_TABLE = 'usuario_telefono';

// Define the UserPhone model
export const UserPhone = sequelize.define(USER_PHONE_TABLE, {

  // Define the 'id' column
  id: {
    // Integer type
    type: DataTypes.INTEGER,
    // This field cannot be null
    allowNull: false,
    // Primary key
    primaryKey: true,
    // Must be unique
    unique: true,
    // Auto increment value
    autoIncrement: true,
    // Database column name
    field: 'id_usuario_telefono',
  },

  // Foreign key to User
  userId: {
    // Integer type
    type: DataTypes.INTEGER,
    // This field cannot be null
    allowNull: false,
    // Database column name
    field: 'id_usuario',

    references: {
      model: 'usuario',
      key: 'id_usuario',
    },

    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },

  // Foreign key to Phone
  phoneId: {
    // Integer type
    type: DataTypes.INTEGER,
    // This field cannot be null
    allowNull: false,
    // Database column name
    field: 'id_telefono',

    references: {
      model: 'telefono',
      key: 'id_telefono',
    },

    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  }

}, {
  // Pass the sequelize instance
  sequelize,

  // Specify the table name
  tableName: USER_PHONE_TABLE,

  // Specify the model name
  modelName: 'userPhone',

  // This table does not have timestamps
  timestamps: false,

  // Composite unique constraint
  indexes: [
    {
      unique: true,
      fields: ['id_usuario', 'id_telefono'],
      name: 'uq_usuario_telefono',
    },
  ],
});