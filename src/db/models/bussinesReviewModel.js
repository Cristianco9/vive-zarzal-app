// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the table name
export const BUSINESS_REVIEW_TABLE = 'resena_negocio';

// Define the BusinessReview model
export const BusinessReview = sequelize.define(BUSINESS_REVIEW_TABLE, {

  // Primary key: id_resena_negocio
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    field: 'id_resena_negocio',
  },

  // Foreign key: business
  businessId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_negocio_resena',
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
    field: 'contenido_resena_negocio',
  },

  // Rating (1 to 5)
  rating: {
    type: DataTypes.SMALLINT,
    allowNull: true,
    field: 'puntuacion_resena_negocio',
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
    field: 'fecha_creacion_resena_negocio',
  },

  // Update timestamp
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: 'fecha_modificacion_resena_negocio',
  },

}, {
  sequelize,
  tableName: BUSINESS_REVIEW_TABLE,
  modelName: 'businessReview',
  timestamps: true,
  // Map Sequelize timestamps to database columns
  createdAt: 'fecha_creacion_resena_negocio',
  updatedAt: 'fecha_modificacion_resena_negocio',
});