// config.js

// Import dotenv package to load environment variables
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

/**
 * Global application configuration
 */
export const config = {

  // ==========================================
  // APPLICATION
  // ==========================================

  env: process.env.NODE_ENV || "development",

  appPort: Number(process.env.APP_PORT) || 3377,

  // ==========================================
  // DATABASE
  // ==========================================

  dbDialect: process.env.DB_DIALECT || "postgres",

  dbHost: process.env.DB_HOST || "127.0.0.1",

  dbPort: Number(process.env.DB_PORT) || 5432,

  dbName: process.env.DB_NAME,

  dbUser: process.env.DB_USER,

  dbPassword: process.env.DB_PASSWORD,

  // ==========================================
  // SEQUELIZE CONNECTION POOL
  // ==========================================

  dbPoolMax: Number(process.env.DB_POOL_MAX) || 20,

  dbPoolMin: Number(process.env.DB_POOL_MIN) || 5,

  dbPoolAcquire: Number(process.env.DB_POOL_ACQUIRE) || 30000,

  dbPoolIdle: Number(process.env.DB_POOL_IDLE) || 10000,

  // ==========================================
  // SECURITY
  // ==========================================

  apiKey: process.env.API_KEY,

  jwtSecretKey: process.env.AUTH_APP_JWT_SECRET_KEY,

  jwtExpiresIn: process.env.AUTH_APP_JWT_EXPIRES_IN || "24h",

};