// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';

// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the departments table
export const DEPARTMENT_TABLE = 'departamento';

// Define the Department model
export const Department = sequelize.define(DEPARTMENT_TABLE, {

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
    field: 'id_departamento',
  },

  // Define the foreign key to country
  countryId: {
    // Integer type
    type: DataTypes.INTEGER,
    // This field cannot be null
    allowNull: false,
    // Database column name
    field: 'id_pais',
    // Foreign key reference
    references: {
      model: 'pais',
      key: 'id_pais',
    },
  },

  // Define the department name
  name: {
    // Text type with a maximum length of 100 characters
    type: DataTypes.STRING(100),
    // This field cannot be null
    allowNull: false,
    // Database column name
    field: 'nombre_departamento',
  },

  // Define the department description
  description: {
    // Text type with a maximum length of 255 characters
    type: DataTypes.STRING(255),
    // This field can be null
    allowNull: true,
    // Database column name
    field: 'descripcion_departamento',
  }

}, {
  // Pass the sequelize instance
  sequelize,

  // Specify the table name
  tableName: DEPARTMENT_TABLE,

  // Specify the model name
  modelName: 'department',

  // The table does not have createdAt and updatedAt fields
  timestamps: false
});