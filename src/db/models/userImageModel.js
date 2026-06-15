// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';

// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the user images table
export const USER_IMAGE_TABLE = 'imagen_usuario';

// Define the UserImage model
export const UserImage = sequelize.define(USER_IMAGE_TABLE, {

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
        field: 'id_imagen_usuario',
    },

    // Foreign key to User
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        field: 'id_usuario',
        references: {
            model: 'usuario',
            key: 'id_usuario',
        },
    },

    // Image URL
    url: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'url_imagen_usuario',
    },

    // Image name
    name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'nombre_imagen_usuario',
    },

    // Alternative text
    altText: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'texto_alternativo_imagen_usuario',
    },

    // Creation date
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'fecha_creacion_imagen_usuario',
    },

    // Last update date
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'fecha_actualizacion_imagen_usuario',
    }

}, {
    // Pass the sequelize instance
    sequelize,

    // Specify the table name
    tableName: USER_IMAGE_TABLE,

    // Specify the model name
    modelName: 'userImage',

    // Enable automatic timestamps
    timestamps: true,

    // Map Sequelize timestamps to database columns
    createdAt: 'fecha_creacion_imagen_usuario',
    updatedAt: 'fecha_actualizacion_imagen_usuario',
});