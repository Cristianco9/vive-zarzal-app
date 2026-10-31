import { DataTypes } from 'sequelize';
import { sequelize } from '../../libraries/DBConnection.js';

export const Comment = sequelize.define(
  'Comment',
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'comments',
    modelName: 'Comment',
    underscored: true,
    timestamps: true,
  }
);
