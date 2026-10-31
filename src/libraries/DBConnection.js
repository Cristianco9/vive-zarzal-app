import { Sequelize } from 'sequelize';
import { config } from '../config/config.js';

export const sequelize = new Sequelize(
  config.dbName,
  config.dbUser,
  config.dbPassword,
  {
    host: config.dbHost,
    port: config.dbPort,
    dialect: config.dbDialect,
    pool: {
      max: config.dbPoolMax,
      min: config.dbPoolMin,
      acquire: config.dbPoolAcquire,
      idle: config.dbPoolIdle,
    },
    logging: config.env === 'development' ? console.log : false,
  }
);

export const testConnection = async () => {
  await sequelize.authenticate();
  console.log('Database connection established.');
};
