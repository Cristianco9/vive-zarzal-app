// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';

// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the categories table
export const CATEGORY_TABLE = 'categoria';

// Define the Category model
export const Category = sequelize.define(CATEGORY_TABLE, {

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
    field: 'id_categoria',
  },

  // Define the category name
  name: {
    // Text type with a maximum length of 100 characters
    type: DataTypes.STRING(100),
    // This field cannot be null
    allowNull: false,
    // Must be unique
    unique: true,
    // Database column name
    field: 'nombre_categoria',
  },

  // Define the category description
  description: {
    // Long text type
    type: DataTypes.TEXT,
    // This field can be null
    allowNull: true,
    // Database column name
    field: 'descripcion_categoria',
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
    field: 'fecha_creacion_categoria',
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
    field: 'fecha_modificacion_categoria',
  }

}, {
  // Pass the sequelize instance
  sequelize,

  // Specify the table name
  tableName: CATEGORY_TABLE,

  // Specify the model name
  modelName: 'category',

  // Enable automatic timestamps
  timestamps: true,

  // Map Sequelize timestamps to database columns
  createdAt: 'fecha_creacion_categoria',
  updatedAt: 'fecha_modificacion_categoria',
});