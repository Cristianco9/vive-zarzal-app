// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';

// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the document types table
export const DOCUMENT_TYPE_TABLE = 'tipo_documento';

// Define the DocumentType model
export const DocumentType = sequelize.define(DOCUMENT_TYPE_TABLE, {

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
    field: 'id_tipo_documento',
  },

  // Define the document type name
  name: {
    // Text type with a maximum length of 100 characters
    type: DataTypes.STRING(100),
    // This field cannot be null
    allowNull: false,
    // Must be unique
    unique: true,
    // Database column name
    field: 'nombre_tipo_documento',
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
    field: 'fecha_creacion_tipo_documento',
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
    field: 'fecha_modificacion_tipo_documento',
  }

}, {
  // Pass the sequelize instance
  sequelize,

  // Specify the table name
  tableName: DOCUMENT_TYPE_TABLE,

  // Specify the model name
  modelName: 'documentType',

  // Enable automatic timestamps
  timestamps: true,

  // Map Sequelize timestamps to database columns
  createdAt: 'fecha_creacion_tipo_documento',
  updatedAt: 'fecha_modificacion_tipo_documento',
});