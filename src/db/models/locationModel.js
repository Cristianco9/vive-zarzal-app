// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';

// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the locations table
export const LOCATION_TABLE = 'ubicacion';

// Define the Location model
export const Location = sequelize.define(LOCATION_TABLE, {

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
    field: 'id_ubicacion',
  },

  // Define the foreign key to city
  cityId: {
    // Integer type
    type: DataTypes.INTEGER,
    // This field cannot be null
    allowNull: false,
    // Database column name
    field: 'id_ciudad',
    // Foreign key reference
    references: {
      model: 'ciudad',
      key: 'id_ciudad',
    },
  },

  // Define the location name
  name: {
    // Text type with a maximum length of 150 characters
    type: DataTypes.STRING(150),
    // This field cannot be null
    allowNull: false,
    // Database column name
    field: 'nombre_ubicacion',
  },

  // Define the location description
  description: {
    // Long text type
    type: DataTypes.TEXT,
    // This field can be null
    allowNull: true,
    // Database column name
    field: 'descripcion_ubicacion',
  },

  // Define the location code
  code: {
    // Text type with a maximum length of 50 characters
    type: DataTypes.STRING(50),
    // This field can be null
    allowNull: true,
    // Database column name
    field: 'codigo_ubicacion',
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
    field: 'fecha_creacion_ubicacion',
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
    field: 'fecha_modificacion_ubicacion',
  }

}, {
  // Pass the sequelize instance
  sequelize,

  // Specify the table name
  tableName: LOCATION_TABLE,

  // Specify the model name
  modelName: 'location',

  // Enable automatic timestamps
  timestamps: true,

  // Map Sequelize timestamps to database columns
  createdAt: 'fecha_creacion_ubicacion',
  updatedAt: 'fecha_modificacion_ubicacion',
});