import { DataTypes } from 'sequelize';
import { sequelize } from '../../libraries/DBConnection.js';

export const Publication = sequelize.define(
  'Publication',
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
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'category_id',
    },
    type: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: { isIn: [['dish', 'recipe']] },
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'image_url',
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'publications',
    modelName: 'Publication',
    underscored: true,
    timestamps: true,
  }
);
