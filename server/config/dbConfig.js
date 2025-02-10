import { sequelize } from "./sequelize.js";

export const dbConnect = async () => {
  return await sequelize.authenticate();
};

export const dbSync = async () => {
  return await sequelize.sync({ force: false });
};
