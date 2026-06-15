// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';

// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the countries table
export const COUNTRY_TABLE = 'pais';

// Define the Country model
export const Country = sequelize.define(COUNTRY_TABLE, {

  // Define the 'id' column
  id: {
    // Integer type
    type: DataTypes.INTEGER,
    // This field cannot be null
    allowNull: false,
    // This field is the primary key
    primaryKey: true,
    // This field must be unique
    unique: true,
    // Auto increment value
    autoIncrement: true,
    // Database column name
    field: 'id_pais',
  },

  // Define the 'name' column
  name: {
    // Text type with a maximum length of 100 characters
    type: DataTypes.STRING(100),
    // This field cannot be null
    allowNull: false,
    // Country names must be unique
    unique: true,
    // Database column name
    field: 'nombre_pais',
  },

  // Define the 'description' column
  description: {
    // Text type with a maximum length of 255 characters
    type: DataTypes.STRING(255),
    // This field can be null
    allowNull: true,
    // Database column name
    field: 'descripcion_pais',
  }

}, {
  // Pass the sequelize instance
  sequelize,

  // Specify the table name
  tableName: COUNTRY_TABLE,

  // Specify the model name
  modelName: 'country',

  // Disable automatic timestamps because
  // the Pais table does not contain
  // createdAt or updatedAt columns
  timestamps: false
});