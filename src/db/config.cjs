require('dotenv').config();

const base = {
  username: process.env.DB_USER || 'food_forum_user',
  password: process.env.DB_PASSWORD || 'local_dev_password',
  database: process.env.DB_NAME || 'food_forum',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 5432,
  dialect: process.env.DB_DIALECT || 'postgres',
  pool: {
    max: Number(process.env.DB_POOL_MAX) || 20,
    min: Number(process.env.DB_POOL_MIN) || 5,
    acquire: Number(process.env.DB_POOL_ACQUIRE) || 30000,
    idle: Number(process.env.DB_POOL_IDLE) || 10000,
  },
};

module.exports = {
  development: { ...base, logging: console.log },
  test: { ...base, logging: false },
  production: { ...base, logging: false },
};
