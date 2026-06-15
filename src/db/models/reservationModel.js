// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the table name
export const RESERVATION_TABLE = 'reserva';

// Define the Reservation model
export const Reservation = sequelize.define(RESERVATION_TABLE, {

  // Primary key: id_reserva
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    field: 'id_reserva',
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
    field: 'fecha_creacion_reserva',
  },

  // Update timestamp
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: 'fecha_modificacion_reserva',
  },

}, {
  sequelize,
  tableName: RESERVATION_TABLE,
  modelName: 'reservation',
  timestamps: true,

  // Map Sequelize timestamps to database columns
  createdAt: 'fecha_creacion_reserva',
  updatedAt: 'fecha_modificacion_reserva',
});