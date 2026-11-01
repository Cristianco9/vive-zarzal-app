import { DataTypes } from 'sequelize';
import { sequelize } from '../../libraries/DBConnection.js';

export const UserDocument = sequelize.define(
  'UserDocument',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    documentTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'document_type_id',
    },
    documentNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'document_number',
    },
    issuedAt: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'issued_at',
    },
    expiresAt: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'expires_at',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_verified',
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'verified_at',
    },
  },
  {
    tableName: 'user_documents',
    modelName: 'UserDocument',
    underscored: true,
    timestamps: true,
    indexes: [
      { unique: true, fields: ['user_id', 'document_type_id'] },
      { unique: true, fields: ['document_type_id', 'document_number'] },
    ],
  }
);
