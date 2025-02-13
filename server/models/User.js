import { dataTypes, sequelize } from "../config/sequelize.js";

export const User = sequelize.define(
  "User",
  {
    user_id: {
      type: dataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: dataTypes.STRING,
      unique: true,
      allowNull:false
    },
    email: {
      type: dataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
      allowNull:false
    },
    password: {
      type: dataTypes.STRING,
      allowNull:false
    },
  },
  {
    tableName: "USER",
    timestamps: true,
  }
);
