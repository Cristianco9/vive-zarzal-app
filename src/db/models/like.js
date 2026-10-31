import { DataTypes } from 'sequelize';
import { sequelize } from '../../libraries/DBConnection.js';

export const Like = sequelize.define(
  'Like',
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
  },
  {
    tableName: 'likes',
    modelName: 'Like',
    underscored: true,
    timestamps: true,
    indexes: [{ unique: true, fields: ['user_id', 'publication_id'] }],
  }
);
