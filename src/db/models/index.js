import { User } from './user.js';
import { Category } from './category.js';
import { Publication } from './publication.js';
import { Like } from './like.js';
import { Rating } from './rating.js';
import { Comment } from './comment.js';
import { Role } from './role.js';
import { Permission } from './permission.js';
import { RolePermission } from './rolePermission.js';
import { UserRole } from './userRole.js';
import { DocumentType } from './documentType.js';
import { UserDocument } from './userDocument.js';
import { Country } from './country.js';
import { Department } from './department.js';
import { City } from './city.js';
import { UserAddress } from './userAddress.js';
import { Tag } from './tag.js';
import { PublicationTag } from './publicationTag.js';
import { Favorite } from './favorite.js';
import { Notification } from './notification.js';
import { Report } from './report.js';

export {
  User,
  Category,
  Publication,
  Like,
  Rating,
  Comment,
  Role,
  Permission,
  RolePermission,
  UserRole,
  DocumentType,
  UserDocument,
  Country,
  Department,
  City,
  UserAddress,
  Tag,
  PublicationTag,
  Favorite,
  Notification,
  Report,
};

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

  User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: 'userId',
    otherKey: 'roleId',
    as: 'roles',
  });
  Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: 'roleId',
    otherKey: 'userId',
    as: 'users',
  });
  User.hasMany(UserRole, {
    foreignKey: 'userId',
    as: 'userRoles',
    onDelete: 'CASCADE',
  });
  UserRole.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Role.hasMany(UserRole, {
    foreignKey: 'roleId',
    as: 'userRoles',
    onDelete: 'CASCADE',
  });
  UserRole.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

  Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: 'roleId',
    otherKey: 'permissionId',
    as: 'permissions',
  });
  Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: 'permissionId',
    otherKey: 'roleId',
    as: 'roles',
  });
  Role.hasMany(RolePermission, {
    foreignKey: 'roleId',
    as: 'rolePermissions',
    onDelete: 'CASCADE',
  });
  RolePermission.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
  Permission.hasMany(RolePermission, {
    foreignKey: 'permissionId',
    as: 'rolePermissions',
    onDelete: 'CASCADE',
  });
  RolePermission.belongsTo(Permission, {
    foreignKey: 'permissionId',
    as: 'permission',
  });

  User.hasMany(UserDocument, {
    foreignKey: 'userId',
    as: 'documents',
    onDelete: 'CASCADE',
  });
  UserDocument.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  DocumentType.hasMany(UserDocument, {
    foreignKey: 'documentTypeId',
    as: 'userDocuments',
    onDelete: 'RESTRICT',
  });
  UserDocument.belongsTo(DocumentType, {
    foreignKey: 'documentTypeId',
    as: 'documentType',
  });

  Country.hasMany(Department, {
    foreignKey: 'countryId',
    as: 'departments',
    onDelete: 'CASCADE',
  });
  Department.belongsTo(Country, { foreignKey: 'countryId', as: 'country' });
  Department.hasMany(City, {
    foreignKey: 'departmentId',
    as: 'cities',
    onDelete: 'CASCADE',
  });
  City.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
  City.hasMany(UserAddress, {
    foreignKey: 'cityId',
    as: 'addresses',
    onDelete: 'RESTRICT',
  });
  UserAddress.belongsTo(City, { foreignKey: 'cityId', as: 'city' });
  User.hasMany(UserAddress, {
    foreignKey: 'userId',
    as: 'addresses',
    onDelete: 'CASCADE',
  });
  UserAddress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  Publication.belongsToMany(Tag, {
    through: PublicationTag,
    foreignKey: 'publicationId',
    otherKey: 'tagId',
    as: 'tags',
  });
  Tag.belongsToMany(Publication, {
    through: PublicationTag,
    foreignKey: 'tagId',
    otherKey: 'publicationId',
    as: 'publications',
  });
  Publication.hasMany(PublicationTag, {
    foreignKey: 'publicationId',
    as: 'tagLinks',
    onDelete: 'CASCADE',
  });
  PublicationTag.belongsTo(Publication, {
    foreignKey: 'publicationId',
    as: 'publication',
  });
  Tag.hasMany(PublicationTag, {
    foreignKey: 'tagId',
    as: 'publicationLinks',
    onDelete: 'CASCADE',
  });
  PublicationTag.belongsTo(Tag, { foreignKey: 'tagId', as: 'tag' });

  User.hasMany(Favorite, {
    foreignKey: 'userId',
    as: 'favorites',
    onDelete: 'CASCADE',
  });
  Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Publication.hasMany(Favorite, {
    foreignKey: 'publicationId',
    as: 'favorites',
    onDelete: 'CASCADE',
  });
  Favorite.belongsTo(Publication, {
    foreignKey: 'publicationId',
    as: 'publication',
  });

  User.hasMany(Notification, {
    foreignKey: 'userId',
    as: 'notifications',
    onDelete: 'CASCADE',
  });
  Notification.belongsTo(User, { foreignKey: 'userId', as: 'recipient' });
  Publication.hasMany(Notification, {
    foreignKey: 'relatedPublicationId',
    as: 'notifications',
    onDelete: 'SET NULL',
  });
  Notification.belongsTo(Publication, {
    foreignKey: 'relatedPublicationId',
    as: 'relatedPublication',
  });

  User.hasMany(Report, {
    foreignKey: 'reporterId',
    as: 'submittedReports',
    onDelete: 'CASCADE',
  });
  Report.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });
  User.hasMany(Report, {
    foreignKey: 'reviewedBy',
    as: 'reviewedReports',
    onDelete: 'SET NULL',
  });
  Report.belongsTo(User, { foreignKey: 'reviewedBy', as: 'reviewer' });
  Publication.hasMany(Report, {
    foreignKey: 'publicationId',
    as: 'reports',
    onDelete: 'CASCADE',
  });
  Report.belongsTo(Publication, {
    foreignKey: 'publicationId',
    as: 'publication',
  });
  Comment.hasMany(Report, {
    foreignKey: 'commentId',
    as: 'reports',
    onDelete: 'CASCADE',
  });
  Report.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' });
}
