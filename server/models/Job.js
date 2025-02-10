import { dataTypes, sequelize } from "../config/sequelize.js";

export const Job = sequelize.define(
  "Job",
  {
    job_id: {
      type: dataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: dataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [1, 255],
      },
    },
    description: dataTypes.TEXT,
    department: dataTypes.STRING(100),
    location: dataTypes.STRING(255),
    location_type: dataTypes.ENUM("onsite", "remote", "hybrid"),
    recruiter_type: dataTypes.ENUM("Internal", "External", "Both"),
    job_preferences: {
      type: dataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue("job_preferences");
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue("job_preferences", JSON.stringify(value));
      },
    },
    posting_settings: {
      type: dataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue("posting_settings");
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue("posting_settings", JSON.stringify(value));
      },
    },
  },
  {
    tableName: "JOBS",
    timestamps: true,
  }
);
