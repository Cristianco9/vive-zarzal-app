import { DataTypes } from 'sequelize';
import { sequelize } from '../../libraries/DBConnection.js';

export const City = sequelize.define(
  'City',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'department_id',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
  },
  {
    tableName: 'cities',
    modelName: 'City',
    underscored: true,
    timestamps: true,
    indexes: [{ unique: true, fields: ['department_id', 'name'] }],
  }
);
