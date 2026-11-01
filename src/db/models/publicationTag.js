import { DataTypes } from 'sequelize';
import { sequelize } from '../../libraries/DBConnection.js';

export const PublicationTag = sequelize.define(
  'PublicationTag',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    publicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'publication_id',
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'tag_id',
    },
  },
  {
    tableName: 'publication_tags',
    modelName: 'PublicationTag',
    underscored: true,
    timestamps: true,
    indexes: [{ unique: true, fields: ['publication_id', 'tag_id'] }],
  }
);
