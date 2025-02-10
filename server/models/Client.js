import { sequelize, dataTypes } from "../config/sequelize.js";

export const Client = sequelize.define(
  "Client",
  {
    id: {
      type: dataTypes.UUID,
      defaultValue: dataTypes.UUIDV4,
      primaryKey: true,
    },
    client_name: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    industry: {
      type: dataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: dataTypes.STRING,
      allowNull: true,
    },
    contact_person: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    contact_email: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    contact_phone: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: dataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
    compliance_settings: {
      type: dataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue("compliance_settings");
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue("compliance_settings", JSON.stringify(value));
      },
    },
  },
  {
    tableName: "CLIENTS",
    timestamps: true,
  }
);
