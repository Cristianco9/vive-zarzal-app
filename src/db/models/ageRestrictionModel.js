// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';

// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the age restriction table
export const AGE_RESTRICTION_TABLE = 'restriccion_edad';

// Define the AgeRestriction model
export const AgeRestriction = sequelize.define(AGE_RESTRICTION_TABLE, {

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
    field: 'id_restriccion_edad',
  },

  // Define the age restriction name
  name: {
    // Text type with a maximum length of 100 characters
    type: DataTypes.STRING(100),
    // This field cannot be null
    allowNull: false,
    // Must be unique
    unique: true,
    // Database column name
    field: 'nombre_restriccion_edad',
  },

  // Define the age restriction description
  description: {
    // Text type with a maximum length of 255 characters
    type: DataTypes.STRING(255),
    // This field can be null
    allowNull: true,
    // Database column name
    field: 'descripcion_restriccion_edad',
  },

  // Define the creation timestamp
  createdAt: {
    // Date type
    type: DataTypes.DATE,
    // Default value
    defaultValue: DataTypes.NOW,
    // This field cannot be null
    allowNull: false,
    // Database column name
    field: 'fecha_creacion_restriccion_edad',
  },

  // Define the update timestamp
  updatedAt: {
    // Date type
    type: DataTypes.DATE,
    // Default value
    defaultValue: DataTypes.NOW,
    // This field cannot be null
    allowNull: false,
    // Database column name
    field: 'fecha_modificacion_restriccion_edad',
  }

}, {
  // Pass the sequelize instance
  sequelize,

  // Specify the table name
  tableName: AGE_RESTRICTION_TABLE,

  // Specify the model name
  modelName: 'ageRestriction',

  // Enable automatic timestamps
  timestamps: true,

  // Map Sequelize timestamps to database columns
  createdAt: 'fecha_creacion_restriccion_edad',
  updatedAt: 'fecha_modificacion_restriccion_edad',
});