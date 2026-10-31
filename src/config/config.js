import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',

  appPort: Number(process.env.APP_PORT) || 3377,

  dbDialect: process.env.DB_DIALECT || 'postgres',
  dbHost: process.env.DB_HOST || '127.0.0.1',
  dbPort: Number(process.env.DB_PORT) || 5432,
  dbName: process.env.DB_NAME || 'food_forum',
  dbUser: process.env.DB_USER || 'food_forum_user',
  dbPassword: process.env.DB_PASSWORD || 'local_dev_password',

  dbPoolMax: Number(process.env.DB_POOL_MAX) || 20,
  dbPoolMin: Number(process.env.DB_POOL_MIN) || 5,
  dbPoolAcquire: Number(process.env.DB_POOL_ACQUIRE) || 30000,
  dbPoolIdle: Number(process.env.DB_POOL_IDLE) || 10000,

  jwtSecretKey:
    process.env.AUTH_APP_JWT_SECRET_KEY ||
    'development-only-secret-change-this-value',
  jwtExpiresIn: process.env.AUTH_APP_JWT_EXPIRES_IN || '24h',

  uploadMaxSizeMb: Number(process.env.UPLOAD_MAX_SIZE_MB) || 5,
};
