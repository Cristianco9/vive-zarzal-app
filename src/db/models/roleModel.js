// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';

// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the roles table
export const ROLE_TABLE = 'rol';

// Define the Role model
export const Role = sequelize.define(ROLE_TABLE, {

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
    field: 'id_rol',
  },

  // Define the role name
  name: {
    // Text type with a maximum length of 50 characters
    type: DataTypes.STRING(50),
    // This field cannot be null
    allowNull: false,
    // Must be unique
    unique: true,
    // Database column name
    field: 'tipo_rol',
  },

  // Define the role description
  description: {
    // Text type with a maximum length of 255 characters
    type: DataTypes.STRING(255),
    // This field can be null
    allowNull: true,
    // Database column name
    field: 'descripcion_rol',
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
    field: 'fecha_creacion_rol',
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
    field: 'fecha_actualizacion_rol',
  }

}, {
  // Pass the sequelize instance
  sequelize,

  // Specify the table name
  tableName: ROLE_TABLE,

  // Specify the model name
  modelName: 'role',

  // Enable automatic timestamps
  timestamps: true,

  // Map Sequelize timestamps to database columns
  createdAt: 'fecha_creacion_rol',
  updatedAt: 'fecha_actualizacion_rol',
});