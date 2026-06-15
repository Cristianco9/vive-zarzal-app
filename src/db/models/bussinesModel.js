// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';

// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the businesses table
export const BUSINESS_TABLE = 'negocio';

// Define the Business model
export const Business = sequelize.define(BUSINESS_TABLE, {

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
    field: 'id_negocio',
  },

  // Foreign key to User (Owner)
  ownerUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario_propietario',

    references: {
      model: 'usuario',
      key: 'id_usuario',
    },

    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  },

  // Foreign key to Location
  locationId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_ubicacion',

    references: {
      model: 'ubicacion',
      key: 'id_ubicacion',
    },

    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },

  // Business name
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    field: 'nombre_negocio',
  },

  // Business description
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descripcion_negocio',
  },

  // Facebook page
  facebook: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'facebook_negocio',
  },

  // Instagram profile
  instagram: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'instagram_negocio',
  },

  // TikTok profile
  tiktok: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'tiktok_negocio',
  },

  // Website
  website: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'pagina_web_negocio',
  },

  // Creation timestamp
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'fecha_creacion_negocio',
  },

  // Update timestamp
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'fecha_modificacion_negocio',
  }

}, {
  // Pass the sequelize instance
  sequelize,

  // Specify the table name
  tableName: BUSINESS_TABLE,

  // Specify the model name
  modelName: 'business',

  // Enable automatic timestamps
  timestamps: true,

  // Map Sequelize timestamps to database columns
  createdAt: 'fecha_creacion_negocio',
  updatedAt: 'fecha_modificacion_negocio',
});