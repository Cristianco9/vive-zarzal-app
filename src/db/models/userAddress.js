import { DataTypes } from 'sequelize';
import { sequelize } from '../../libraries/DBConnection.js';

export const UserAddress = sequelize.define(
  'UserAddress',
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
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'city_id',
    },
    label: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    line1: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    line2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'postal_code',
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_primary',
    },
  },
  {
    tableName: 'user_addresses',
    modelName: 'UserAddress',
    underscored: true,
    timestamps: true,
    indexes: [{ fields: ['user_id'] }, { fields: ['city_id'] }],
  }
);
