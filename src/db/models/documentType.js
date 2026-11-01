import { DataTypes } from 'sequelize';
import { sequelize } from '../../libraries/DBConnection.js';

export const DocumentType = sequelize.define(
  'DocumentType',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    tableName: 'document_types',
    modelName: 'DocumentType',
    underscored: true,
    timestamps: true,
  }
);
