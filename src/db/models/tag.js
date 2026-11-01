import { DataTypes } from 'sequelize';
import { sequelize } from '../../libraries/DBConnection.js';

export const Tag = sequelize.define(
  'Tag',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'tags',
    modelName: 'Tag',
    underscored: true,
    timestamps: true,
  }
);
