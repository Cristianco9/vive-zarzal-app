// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the table name
export const RESERVATION_DETAIL_TABLE = 'reserva_detalle';

// Define the ReservationDetail model
export const ReservationDetail = sequelize.define(RESERVATION_DETAIL_TABLE, {

  // Primary key: id_reserva_detalle
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    field: 'id_reserva_detalle',
  },

  // Foreign key: reservation
  reservationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_reserva',
  },

  // Foreign key: user
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario',
  },

  // Quantity
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'cantidad_reserva',
    validate: {
      min: 1,
    },
  },

  // Foreign key: reservation status
  reservationStatusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_estado_reserva',
  },

}, {
  sequelize,
  tableName: RESERVATION_DETAIL_TABLE,
  modelName: 'reservationDetail',
  timestamps: false
});