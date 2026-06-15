// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';

// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the phones table
export const PHONE_TABLE = 'telefono';

// Define the Phone model
export const Phone = sequelize.define(PHONE_TABLE, {

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
    field: 'id_telefono',
  },

  // Phone number
  phoneNumber: {
    // Text type with a maximum length of 20 characters
    type: DataTypes.STRING(20),
    // This field cannot be null
    allowNull: false,
    // Database column name
    field: 'numero_telefono',
  },

  // Creation timestamp
  createdAt: {
    // Date type
    type: DataTypes.DATE,
    // Automatically set the current timestamp when the record is created
    defaultValue: DataTypes.NOW,
    // This field cannot be null
    allowNull: false,
    // Database column name
    field: 'fecha_creacion_telefono',
  },

  // Update timestamp
  updatedAt: {
    // Date type
    type: DataTypes.DATE,
    // Automatically update the timestamp when the record is updated
    defaultValue: DataTypes.NOW,
    // This field cannot be null
    allowNull: false,
    // Database column name
    field: 'fecha_modificacion_telefono',
  }

}, {
  // Pass the sequelize instance
  sequelize,

  // Specify the table name
  tableName: PHONE_TABLE,

  // Specify the model name
  modelName: 'phone',

  // Enable automatic timestamps
  timestamps: true,

  // Map Sequelize timestamps to database columns
  createdAt: 'fecha_creacion_telefono',
  updatedAt: 'fecha_modificacion_telefono',
});