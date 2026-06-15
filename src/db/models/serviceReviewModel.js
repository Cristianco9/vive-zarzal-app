// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the table name
export const SERVICE_REVIEW_TABLE = 'resena_servicio';

// Define the ServiceReview model
export const ServiceReview = sequelize.define(SERVICE_REVIEW_TABLE, {

  // Primary key: id_resena_servicio
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    field: 'id_resena_servicio',
  },

  // Foreign key: service
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_servicio_resena',
  },

  // Foreign key: user
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario_resena',
  },

  // Review content
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'contenido_resena_servicio',
  },

  // Rating (1 to 5)
  rating: {
    type: DataTypes.SMALLINT,
    allowNull: true,
    field: 'puntuacion_resena_servicio',
    validate: {
      min: 1,
      max: 5,
    },
  },

  // Creation timestamp
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: 'fecha_creacion_resena_servicio',
  },

  // Update timestamp
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: 'fecha_modificacion_resena_servicio',
  },

}, {
  sequelize,
  tableName: SERVICE_REVIEW_TABLE,
  modelName: 'serviceReview',
  timestamps: true,

  // Map Sequelize timestamps to database columns
  createdAt: 'fecha_creacion_resena_servicio',
  updatedAt: 'fecha_modificacion_resena_servicio',
});