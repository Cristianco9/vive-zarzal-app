// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the table name
export const SERVICE_TABLE = 'servicio';

// Define the Service model
export const Service = sequelize.define(SERVICE_TABLE, {

  // Primary key: id_servicio
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    field: 'id_servicio',
  },

  // Service name
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'nombre_servicio',
  },

  // Service description
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descripcion_servicio',
  },

  // Service price
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'precio_servicio',
    validate: {
      min: 0,
    },
  },

  // Foreign key: category
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_categoria_servicio',
  },

  // Foreign key: service status
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_estado_servicio',
  },

  // Foreign key: age restriction (optional)
  ageRestrictionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_restriccion_edad_servicio',
  },

  // Foreign key: business
  businessId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_negocio',
  },

  // Creation timestamp
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: 'fecha_creacion_servicio',
  },

  // Last modification timestamp
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: 'fecha_modificacion_servicio',
  },

}, {
  sequelize,
  tableName: SERVICE_TABLE,
  modelName: 'service',
  timestamps: true,
  
  // Map Sequelize timestamps to database columns
  createdAt: 'fecha_creacion_servicio',
  updatedAt: 'fecha_modificacion_servicio',
});