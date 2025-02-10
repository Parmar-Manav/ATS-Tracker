// import { User } from "../models/User.js";
import { Client } from "../models/Client.js";
import { Job } from "../models/Job.js";
// import { Onboarding_Template } from "../models/OnboardingTemplate.js";

export const SetupAssociations = () => {
  // User.hasMany(Client, {
  //   foreignKey: "user_id",
  //   onDelete: "CASCADE",
  // });
  // Client.belongsTo(User, {
  //   foreignKey: "user_id",
  // });
  Client.hasMany(Job, {
    foreignKey: "client_id",
    onDelete: "CASCADE",
  });
  Job.belongsTo(Client, {
    foreignKey: "client_id",
  });
  // Client.hasMany(Onboarding_Template, {
  //   foreignKey: "client_id",
  //   onDelete: "CASCADE",
  // });
  // Onboarding_Template.belongsTo(Client, {
  //   foreignKey: "client_id",
  // });
};
