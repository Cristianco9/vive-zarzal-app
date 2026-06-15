// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the table name
export const SERVICE_IMAGE_TABLE = 'imagen_servicio';

// Define the ServiceImage model
export const ServiceImage = sequelize.define(SERVICE_IMAGE_TABLE, {

  // Primary key: id_imagen_servicio
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    field: 'id_imagen_servicio',
  },

  // Image URL
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'url_imagen_servicio',
  },

  // Image description
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'descripcion_imagen_servicio',
  },

  // Foreign key: service
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_servicio',
  },

  // Creation timestamp
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: 'fecha_creacion_imagen_servicio',
  },

  // Update timestamp
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: 'fecha_modificacion_imagen_servicio',
  },

}, {
  sequelize,
  tableName: SERVICE_IMAGE_TABLE,
  modelName: 'serviceImage',
  timestamps: true,

  // Map Sequelize timestamps to database columns
  createdAt: 'fecha_creacion_imagen_servicio',
  updatedAt: 'fecha_modificacion_imagen_servicio',
});