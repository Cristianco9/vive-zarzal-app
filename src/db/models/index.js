import { User } from './user.js';
import { Category } from './category.js';
import { Publication } from './publication.js';
import { Like } from './like.js';
import { Rating } from './rating.js';
import { Comment } from './comment.js';

export { User, Category, Publication, Like, Rating, Comment };

export function setupAssociations() {
  User.hasMany(Publication, {
    foreignKey: 'userId',
    as: 'publications',
    onDelete: 'CASCADE',
  });
  Publication.belongsTo(User, { foreignKey: 'userId', as: 'author' });

  Category.hasMany(Publication, {
    foreignKey: 'categoryId',
    as: 'publications',
  });
  Publication.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

  User.hasMany(Like, { foreignKey: 'userId', as: 'likes', onDelete: 'CASCADE' });
  Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Publication.hasMany(Like, {
    foreignKey: 'publicationId',
    as: 'likes',
    onDelete: 'CASCADE',
  });
  Like.belongsTo(Publication, { foreignKey: 'publicationId', as: 'publication' });

  User.hasMany(Rating, {
    foreignKey: 'userId',
    as: 'ratings',
    onDelete: 'CASCADE',
  });
  Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Publication.hasMany(Rating, {
    foreignKey: 'publicationId',
    as: 'ratings',
    onDelete: 'CASCADE',
  });
  Rating.belongsTo(Publication, {
    foreignKey: 'publicationId',
    as: 'publication',
  });

  User.hasMany(Comment, {
    foreignKey: 'userId',
    as: 'comments',
    onDelete: 'CASCADE',
  });
  Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
  Publication.hasMany(Comment, {
    foreignKey: 'publicationId',
    as: 'comments',
    onDelete: 'CASCADE',
  });
  Comment.belongsTo(Publication, {
    foreignKey: 'publicationId',
    as: 'publication',
  });
}
