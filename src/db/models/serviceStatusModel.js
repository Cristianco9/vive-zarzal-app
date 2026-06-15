// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the table name
export const SERVICE_STATUS_TABLE = 'estado_servicio';

// Define the ServiceStatus model
export const ServiceStatus = sequelize.define(SERVICE_STATUS_TABLE, {

  // Primary key: id_estado_servicio
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    field: 'id_estado_servicio',
  },

  // Status name
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'nombre_estado_servicio',
  },

  // Status description
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'descripcion_estado_servicio',
  },

  // Creation timestamp
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: 'fecha_creacion_estado_servicio',
  },

  // Update timestamp
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: 'fecha_modificacion_estado_servicio',
  },

}, {
  sequelize,
  tableName: SERVICE_STATUS_TABLE,
  modelName: 'serviceStatus',
  timestamps: true,

  // Map Sequelize timestamps to database columns
  createdAt: 'fecha_creacion_estado_servicio',
  updatedAt: 'fecha_modificacion_estado_servicio',
});