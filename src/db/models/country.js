import { DataTypes } from 'sequelize';
import { sequelize } from '../../libraries/DBConnection.js';

export const Country = sequelize.define(
  'Country',
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
    iso2: {
      type: DataTypes.STRING(2),
      allowNull: false,
      unique: true,
    },
    iso3: {
      type: DataTypes.STRING(3),
      allowNull: true,
      unique: true,
    },
    phoneCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'phone_code',
    },
  },
  {
    tableName: 'countries',
    modelName: 'Country',
    underscored: true,
    timestamps: true,
  }
);
