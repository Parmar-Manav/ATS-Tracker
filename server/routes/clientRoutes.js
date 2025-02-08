import express from "express";
import {
  createClients,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/clientCtrl.js";

const router = express.Router();

router.post("/", createClients);
router.get("/", getClients);
router.get("/:id", getClientById);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;
