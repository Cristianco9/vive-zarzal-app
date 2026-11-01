import { DataTypes } from 'sequelize';
import { sequelize } from '../../libraries/DBConnection.js';

export const Report = sequelize.define(
  'Report',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reporterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'reporter_id',
    },
    publicationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'publication_id',
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'comment_id',
    },
    reason: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
    },
    reviewedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'reviewed_by',
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reviewed_at',
    },
  },
  {
    tableName: 'reports',
    modelName: 'Report',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['status'] },
      { fields: ['publication_id'] },
      { fields: ['comment_id'] },
      { fields: ['reporter_id'] },
    ],
  }
);
