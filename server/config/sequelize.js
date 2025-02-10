import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const dataTypes = DataTypes;

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mssql",
    logging: false,
    dialectOptions: {
      options: {
        trustServerCertificate: true,
      },
    },
    pool: {
      max: parseInt(process.env.DB_POOL_MAX),
      min: parseInt(process.env.DB_POOL_MIN),
      acquire: parseInt(process.env.DB_POOL_ACQUIRE),
      idle: parseInt(process.env.DB_POOL_IDLE),
    },
  }
);
