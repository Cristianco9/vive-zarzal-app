import { DataTypes } from 'sequelize';
import { sequelize } from '../../libraries/DBConnection.js';

export const RolePermission = sequelize.define(
  'RolePermission',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'role_id',
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'permission_id',
    },
  },
  {
    tableName: 'role_permissions',
    modelName: 'RolePermission',
    underscored: true,
    timestamps: true,
    indexes: [{ unique: true, fields: ['role_id', 'permission_id'] }],
  }
);
