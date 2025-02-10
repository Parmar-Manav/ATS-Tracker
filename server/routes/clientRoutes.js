import express from "express";
import {
  createClients,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/clientCtrl.js";

export const clientRouter = express.Router();

clientRouter.post("/", createClients);
clientRouter.get("/", getClients);
clientRouter.get("/:id", getClientById);
clientRouter.patch("/:id", updateClient);
clientRouter.delete("/:id", deleteClient);
