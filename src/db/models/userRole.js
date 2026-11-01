import { DataTypes } from 'sequelize';
import { sequelize } from '../../libraries/DBConnection.js';

export const UserRole = sequelize.define(
  'UserRole',
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
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'role_id',
    },
  },
  {
    tableName: 'user_roles',
    modelName: 'UserRole',
    underscored: true,
    timestamps: true,
    indexes: [{ unique: true, fields: ['user_id', 'role_id'] }],
  }
);
