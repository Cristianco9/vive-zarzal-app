// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the table name
export const SERVICE_FAVORITE_TABLE = 'servicio_favoritos_usuarios';

// Define the ServiceFavorite model
export const ServiceFavorite = sequelize.define(SERVICE_FAVORITE_TABLE, {

  // Primary key: id_servicio_favorito
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    field: 'id_servicio_favorito',
  },

  // Foreign key: user
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario_favorito',
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
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'fecha_creacion_servicio_favorito',
  },

}, {
  sequelize,
  tableName: SERVICE_FAVORITE_TABLE,
  modelName: 'serviceFavorite',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['id_usuario_favorito', 'id_servicio'],
    }
  ]
});