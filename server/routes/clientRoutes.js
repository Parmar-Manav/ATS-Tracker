// import express from "express";
// import {
//   createClients,
//   getClients,
//   getClientById,
//   updateClient,
//   deleteClient,
// } from "../controllers/clientCtrl.js";

// const router = express.Router();

// router.route("/")
//   .get(getClients)
//   .post(createClients);

// router.route("/:id")
//   .get(getClientById)
//   .patch(updateClient)
//   .delete(deleteClient);

// export default router;
import express from "express";
import {
  createClients,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  searchClients
} from "../controllers/clientCtrl.js";

const clientRouter = express.Router();

clientRouter.post("/", createClients);
clientRouter.get("/", getClients);
clientRouter.get("/:id", getClientById);
clientRouter.patch("/:id", updateClient);
clientRouter.delete("/:id", deleteClient);
clientRouter.get("/temp/:search",
  searchClients);

export default clientRouter;