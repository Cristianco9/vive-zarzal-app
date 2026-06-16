// ============================================================
// VIVE ZARZAL - SEQUELIZE ASSOCIATIONS
// ============================================================
// This file defines all relationships between models.
// Import and call setupAssociations() AFTER all models are
// loaded, before the database connection is synchronized.
// ============================================================

import { Country }           from './countryModel.js';
import { Department }        from './departmentModel.js';
import { City }              from './cityModel.js';
import { Location }          from './locationModel.js';

import { Role }              from './roleModel.js';
import { Gender }            from './genderModel.js';
import { DocumentType }      from './documentTypeModel.js';

import { User }              from './userModel.js';
import { UserImage }         from './userImageModel.js';
import { Phone }             from './phoneModel.js';
import { UserPhone }         from './userPhoneModel.js';

import { Business }          from './businessModel.js';
import { BusinessPhone }     from './businessPhoneModel.js';

import { Category }          from './categoryModel.js';
import { ServiceStatus }      from './serviceStatusModel.js';
import { AgeRestriction }    from './ageRestrictionModel.js';
import { Service }           from './serviceModel.js';
import { ServiceImage }      from './serviceImageModel.js';

import { Reservation }       from './reservationModel.js';
import { ReservationDetail } from './reservationDetailsModel.js';
import { ReservationStatus } from './reserveStatusModel.js';

import { MessageStatus }     from './messageStatusModel.js';
import { Message }           from './messageModel.js';

import { BusinessReview }    from './businessReviewModel.js';
import { ServiceReview }     from './serviceReviewModel.js';

import { ServiceFavorite }   from './favoriteUserServiceModel.js';

export function setupAssociations() {

  // ============================================================
  // GEOGRAPHIC CATALOG
  // Country → Department → City → Location
  // ============================================================

  // A country has many departments
  Country.hasMany(Department, {
    foreignKey: 'countryId',
    sourceKey: 'id',
    as: 'departments',
  });

  // A department belongs to one country
  Department.belongsTo(Country, {
    foreignKey: 'countryId',
    targetKey: 'id',
    as: 'country',
  });

  // A department has many cities
  Department.hasMany(City, {
    foreignKey: 'departmentId',
    sourceKey: 'id',
    as: 'cities',
  });

  // A city belongs to one department
  City.belongsTo(Department, {
    foreignKey: 'departmentId',
    targetKey: 'id',
    as: 'department',
  });

  // A city has many locations
  City.hasMany(Location, {
    foreignKey: 'cityId',
    sourceKey: 'id',
    as: 'locations',
  });

  // A location belongs to one city
  Location.belongsTo(City, {
    foreignKey: 'cityId',
    targetKey: 'id',
    as: 'city',
  });

  // ============================================================
  // USER
  // ============================================================

  // A role can have many users
  Role.hasMany(User, {
    foreignKey: 'roleId',
    sourceKey: 'id',
    as: 'users',
  });

  // A user belongs to one role
  User.belongsTo(Role, {
    foreignKey: 'roleId',
    targetKey: 'id',
    as: 'role',
  });

  // A gender can have many users
  Gender.hasMany(User, {
    foreignKey: 'genderId',
    sourceKey: 'id',
    as: 'users',
  });

  // A user belongs to one gender (optional)
  User.belongsTo(Gender, {
    foreignKey: 'genderId',
    targetKey: 'id',
    as: 'gender',
  });

  // A document type can have many users
  DocumentType.hasMany(User, {
    foreignKey: 'documentTypeId',
    sourceKey: 'id',
    as: 'users',
  });

  // A user belongs to one document type (optional)
  User.belongsTo(DocumentType, {
    foreignKey: 'documentTypeId',
    targetKey: 'id',
    as: 'documentType',
  });

  // ============================================================
  // USER IMAGE
  // One-many: User → UserImage
  // ============================================================

  // A user has many profile image
  User.hasMany(UserImage, {
    foreignKey: 'userId',
    sourceKey: 'id',
    as: 'profileImage',
    onDelete: 'CASCADE',
  });

  // A user image belongs to one user
  UserImage.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'user',
  });

  // ============================================================
  // USER PHONES (many-to-many via UserPhone)
  // ============================================================

  // A user has many phones (through the junction table)
  User.belongsToMany(Phone, {
    through: UserPhone,
    foreignKey: 'userId',
    otherKey: 'phoneId',
    as: 'phones',
  });

  // A phone can belong to many users (through the junction table)
  Phone.belongsToMany(User, {
    through: UserPhone,
    foreignKey: 'phoneId',
    otherKey: 'userId',
    as: 'users',
  });

  // Direct associations to the junction table (for eager loading details)
  User.hasMany(UserPhone, {
    foreignKey: 'userId',
    sourceKey: 'id',
    as: 'userPhones',
  });
  UserPhone.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'user',
  });

  Phone.hasMany(UserPhone, {
    foreignKey: 'phoneId',
    sourceKey: 'id',
    as: 'userPhones',
  });
  UserPhone.belongsTo(Phone, {
    foreignKey: 'phoneId',
    targetKey: 'id',
    as: 'phone',
  });

  // ============================================================
  // BUSINESS
  // ============================================================

  // A user (owner) can have one business
  User.hasOne(Business, {
    foreignKey: 'ownerUserId',
    sourceKey: 'id',
    as: 'businesses',
  });

  // A business belongs to one owner user
  Business.belongsTo(User, {
    foreignKey: 'ownerUserId',
    targetKey: 'id',
    as: 'owner',
  });

  // A location can have one businesses
  Location.hasOne(Business, {
    foreignKey: 'locationId',
    sourceKey: 'id',
    as: 'businesses',
  });

  // A business belongs to one location (optional)
  Business.belongsTo(Location, {
    foreignKey: 'locationId',
    targetKey: 'id',
    as: 'location',
  });

  // ============================================================
  // BUSINESS PHONES (many-to-many via BusinessPhone)
  // ============================================================

  // A business has many phones (through the junction table)
  Business.belongsToMany(Phone, {
    through: BusinessPhone,
    foreignKey: 'idBusiness',
    otherKey: 'idPhone',
    as: 'phones',
  });

  // A phone can belong to many businesses (through the junction table)
  Phone.belongsToMany(Business, {
    through: BusinessPhone,
    foreignKey: 'idPhone',
    otherKey: 'idBusiness',
    as: 'businesses',
  });

  // Direct associations to the junction table
  Business.hasMany(BusinessPhone, {
    foreignKey: 'idBusiness',
    sourceKey: 'id',
    as: 'businessPhones',
  });
  BusinessPhone.belongsTo(Business, {
    foreignKey: 'idBusiness',
    targetKey: 'id',
    as: 'business',
  });

  Phone.hasMany(BusinessPhone, {
    foreignKey: 'idPhone',
    sourceKey: 'id',
    as: 'businessPhones',
  });
  BusinessPhone.belongsTo(Phone, {
    foreignKey: 'idPhone',
    targetKey: 'id',
    as: 'phone',
  });

  // ============================================================
  // SERVICE
  // ============================================================

  // A category has many services
  Category.hasMany(Service, {
    foreignKey: 'categoryId',
    sourceKey: 'id',
    as: 'services',
  });

  // A service belongs to one category
  Service.belongsTo(Category, {
    foreignKey: 'categoryId',
    targetKey: 'id',
    as: 'category',
  });

  // A service state has many services
  ServiceStatus.hasMany(Service, {
    foreignKey: 'statusId',
    sourceKey: 'id',
    as: 'services',
  });

  // A service belongs to one service state
  Service.belongsTo(ServiceStatus, {
    foreignKey: 'statusId',
    targetKey: 'id',
    as: 'status',
  });

  // An age restriction can apply to many services
  AgeRestriction.hasMany(Service, {
    foreignKey: 'ageRestrictionId',
    sourceKey: 'id',
    as: 'services',
  });

  // A service belongs to one age restriction (optional)
  Service.belongsTo(AgeRestriction, {
    foreignKey: 'ageRestrictionId',
    targetKey: 'id',
    as: 'ageRestriction',
  });

  // A business has many services
  Business.hasMany(Service, {
    foreignKey: 'businessId',
    sourceKey: 'id',
    as: 'services',
    onDelete: 'CASCADE',
  });

  // A service belongs to one business
  Service.belongsTo(Business, {
    foreignKey: 'businessId',
    targetKey: 'id',
    as: 'business',
  });

  // ============================================================
  // SERVICE IMAGES
  // ============================================================

  // A service has many images
  Service.hasMany(ServiceImage, {
    foreignKey: 'serviceId',
    sourceKey: 'id',
    as: 'images',
    onDelete: 'CASCADE',
  });

  // A service image belongs to one service
  ServiceImage.belongsTo(Service, {
    foreignKey: 'serviceId',
    targetKey: 'id',
    as: 'service',
  });

  // ============================================================
  // RESERVATION
  // ============================================================

  // A service has many reservations
  Service.hasMany(Reservation, {
    foreignKey: 'serviceId',
    sourceKey: 'id',
    as: 'reservations',
    onDelete: 'CASCADE',
  });

  // A reservation belongs to one service
  Reservation.belongsTo(Service, {
    foreignKey: 'serviceId',
    targetKey: 'id',
    as: 'service',
  });

  // A reservation has many detail entries
  Reservation.hasMany(ReservationDetail, {
    foreignKey: 'reservationId',
    sourceKey: 'id',
    as: 'details',
    onDelete: 'CASCADE',
  });

  // A reservation detail belongs to one reservation
  ReservationDetail.belongsTo(Reservation, {
    foreignKey: 'reservationId',
    targetKey: 'id',
    as: 'reservation',
  });

  // A user can have many reservation details
  User.hasMany(ReservationDetail, {
    foreignKey: 'userId',
    sourceKey: 'id',
    as: 'reservationDetails',
  });

  // A reservation detail belongs to one user
  ReservationDetail.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'user',
  });

  // A reservation status can have many reservation details
  ReservationStatus.hasMany(ReservationDetail, {
    foreignKey: 'reservationStatusId',
    sourceKey: 'id',
    as: 'reservationDetails',
  });

  // A reservation detail belongs to one reservation status
  ReservationDetail.belongsTo(ReservationStatus, {
    foreignKey: 'reservationStatusId',
    targetKey: 'id',
    as: 'status',
  });

  // ============================================================
  // MESSAGES
  // ============================================================

  // A message status can have many messages
  MessageStatus.hasMany(Message, {
    foreignKey: 'statusId',
    sourceKey: 'id',
    as: 'messages',
  });

  // A message belongs to one message status
  Message.belongsTo(MessageStatus, {
    foreignKey: 'statusId',
    targetKey: 'id',
    as: 'status',
  });

  // A user can send many messages
  User.hasMany(Message, {
    foreignKey: 'senderUserId',
    sourceKey: 'id',
    as: 'sentMessages',
  });

  // A message belongs to one sender user
  Message.belongsTo(User, {
    foreignKey: 'senderUserId',
    targetKey: 'id',
    as: 'sender',
  });

  // A user can receive many messages
  User.hasMany(Message, {
    foreignKey: 'receiverUserId',
    sourceKey: 'id',
    as: 'receivedMessages',
  });

  // A message belongs to one receiver user
  Message.belongsTo(User, {
    foreignKey: 'receiverUserId',
    targetKey: 'id',
    as: 'receiver',
  });

  // ============================================================
  // BUSINESS REVIEWS
  // ============================================================

  // A business has many reviews
  Business.hasMany(BusinessReview, {
    foreignKey: 'businessId',
    sourceKey: 'id',
    as: 'reviews',
    onDelete: 'CASCADE',
  });

  // A business review belongs to one business
  BusinessReview.belongsTo(Business, {
    foreignKey: 'businessId',
    targetKey: 'id',
    as: 'business',
  });

  // A user can write many business reviews
  User.hasMany(BusinessReview, {
    foreignKey: 'userId',
    sourceKey: 'id',
    as: 'businessReviews',
  });

  // A business review belongs to one user
  BusinessReview.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'user',
  });

  // ============================================================
  // SERVICE REVIEWS
  // ============================================================

  // A service has many reviews
  Service.hasMany(ServiceReview, {
    foreignKey: 'serviceId',
    sourceKey: 'id',
    as: 'reviews',
    onDelete: 'CASCADE',
  });

  // A service review belongs to one service
  ServiceReview.belongsTo(Service, {
    foreignKey: 'serviceId',
    targetKey: 'id',
    as: 'service',
  });

  // A user can write many service reviews
  User.hasMany(ServiceReview, {
    foreignKey: 'userId',
    sourceKey: 'id',
    as: 'serviceReviews',
  });

  // A service review belongs to one user
  ServiceReview.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'user',
  });

  // ============================================================
  // FAVORITE SERVICES (many-to-many via ServiceFavorite)
  // ============================================================

  // A user can have many favorite services (through the junction table)
  User.belongsToMany(Service, {
    through: ServiceFavorite,
    foreignKey: 'userId',
    otherKey: 'serviceId',
    as: 'favoriteServices',
  });

  // A service can be favorited by many users (through the junction table)
  Service.belongsToMany(User, {
    through: ServiceFavorite,
    foreignKey: 'serviceId',
    otherKey: 'userId',
    as: 'favoritedBy',
  });

  // Direct associations to the junction table
  User.hasMany(ServiceFavorite, {
    foreignKey: 'userId',
    sourceKey: 'id',
    as: 'serviceFavorites',
  });
  ServiceFavorite.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'user',
  });

  Service.hasMany(ServiceFavorite, {
    foreignKey: 'serviceId',
    sourceKey: 'id',
    as: 'favorites',
  });
  ServiceFavorite.belongsTo(Service, {
    foreignKey: 'serviceId',
    targetKey: 'id',
    as: 'service',
  });

}