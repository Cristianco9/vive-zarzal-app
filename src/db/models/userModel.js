// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';

// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the users table
export const USER_TABLE = 'usuario';

// Define the User model
export const User = sequelize.define(USER_TABLE, {

  // Define the 'id' column
  id: {
    // Integer type
    type: DataTypes.INTEGER,
    // This field cannot be null
    allowNull: false,
    // Primary key
    primaryKey: true,
    // Must be unique
    unique: true,
    // Auto increment value
    autoIncrement: true,
    // Database column name
    field: 'id_usuario',
  },

  // Foreign key to Role
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_rol',
    references: {
      model: 'rol',
      key: 'id_rol',
    },
  },

  // Foreign key to Gender
  genderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_genero',
    references: {
      model: 'genero',
      key: 'id_genero',
    },
  },

  // Foreign key to Document Type
  documentTypeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_tipo_documento',
    references: {
      model: 'tipo_documento',
      key: 'id_tipo_documento',
    },
  },

  // User first name
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nombre_usuario',
  },

  // User last name
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'apellido_usuario',
  },

  // Birth date
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'fecha_nacimiento_usuario',
  },

  // Document number
  documentNumber: {
    type: DataTypes.STRING(30),
    allowNull: true,
    unique: true,
    field: 'numero_documento_usuario',
  },

  // Email
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    field: 'correo_usuario',
    validate: {
      isEmail: true,
    },
  },

  // Username
  username: {
    type: DataTypes.STRING(80),
    allowNull: false,
    unique: true,
    field: 'username_usuario',
  },

  // Password hash
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'contrasena_usuario',
  },

  // Creation date
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'fecha_creacion_usuario',
  },

  // Last update date
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'fecha_actualizacion_usuario',
  }

}, {
  // Pass the sequelize instance
  sequelize,

  // Specify the table name
  tableName: USER_TABLE,

  // Specify the model name
  modelName: 'user',

  // Enable automatic timestamps
  timestamps: true,

  // Map Sequelize timestamps to database columns
  createdAt: 'fecha_creacion_usuario',
  updatedAt: 'fecha_actualizacion_usuario',
});