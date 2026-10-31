import { DataTypes } from 'sequelize';
import { sequelize } from '../../libraries/DBConnection.js';

export const Rating = sequelize.define(
  'Rating',
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
    publicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'publication_id',
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
  },
  {
    tableName: 'ratings',
    modelName: 'Rating',
    underscored: true,
    timestamps: true,
    indexes: [{ unique: true, fields: ['user_id', 'publication_id'] }],
  }
);
