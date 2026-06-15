// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the table name
export const MESSAGE_TABLE = 'mensaje';

// Define the Message model
export const Message = sequelize.define(MESSAGE_TABLE, {

  // Primary key: id_mensaje
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    field: 'id_mensaje',
  },

  // Message content
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'contenido_mensaje',
  },

  // Send timestamp
  sentAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'fecha_envio_mensaje',
  },

  // Foreign key: message status
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_estado_mensaje',
  },

  // Foreign key: sender user
  senderUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario_emisor',
  },

  // Foreign key: receiver user
  receiverUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario_receptor',
  },

}, {
  sequelize,
  tableName: MESSAGE_TABLE,
  modelName: 'message',
  timestamps: false
});