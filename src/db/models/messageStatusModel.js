// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';

// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the message status table
export const MESSAGE_STATUS_TABLE = 'estado_mensaje';

// Define the MessageStatus model
export const MessageStatus = sequelize.define(MESSAGE_STATUS_TABLE, {

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
    field: 'id_estado_mensaje',
  },

  // Define the message status name
  name: {
    // Text type with a maximum length of 50 characters
    type: DataTypes.STRING(50),
    // This field cannot be null
    allowNull: false,
    // Must be unique
    unique: true,
    // Database column name
    field: 'nombre_estado_mensaje',
  },

  // Define the message status description
  description: {
    // Text type with a maximum length of 255 characters
    type: DataTypes.STRING(255),
    // This field can be null
    allowNull: true,
    // Database column name
    field: 'descripcion_estado_mensaje',
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
    field: 'fecha_creacion_estado_mensaje',
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
    field: 'fecha_modificacion_estado_mensaje',
  }

}, {
  // Pass the sequelize instance
  sequelize,

  // Specify the table name
  tableName: MESSAGE_STATUS_TABLE,

  // Specify the model name
  modelName: 'messageStatus',

  // Enable automatic timestamps
  timestamps: true,

  // Map Sequelize timestamps to database columns
  createdAt: 'fecha_creacion_estado_mensaje',
  updatedAt: 'fecha_modificacion_estado_mensaje',
});