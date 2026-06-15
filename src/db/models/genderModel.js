// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';

// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the genders table
export const GENDER_TABLE = 'genero';

// Define the Gender model
export const Gender = sequelize.define(GENDER_TABLE, {

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
    field: 'id_genero',
  },

  // Define the gender name
  name: {
    // Text type with a maximum length of 50 characters
    type: DataTypes.STRING(50),
    // This field cannot be null
    allowNull: false,
    // Must be unique
    unique: true,
    // Database column name
    field: 'tipo_genero',
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
    field: 'fecha_creacion_genero',
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
    field: 'fecha_actualizacion_genero',
  }

}, {
  // Pass the sequelize instance
  sequelize,

  // Specify the table name
  tableName: GENDER_TABLE,

  // Specify the model name
  modelName: 'gender',

  // Enable automatic timestamps
  timestamps: true,

  // Map Sequelize timestamps to database columns
  createdAt: 'fecha_creacion_genero',
  updatedAt: 'fecha_actualizacion_genero',
});