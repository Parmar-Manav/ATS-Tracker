import { Client } from "../models/Client.js";
import asyncHandler from "express-async-handler";

//@desc  Add a new Client
//@route POST /Clients
//@access Public
export const createClients = asyncHandler(async (req, res, next) => {
  var Clients = req.body;
  if (!Clients || (Array.isArray(Clients) && Clients.length === 0)) {
    res.status(400);
    throw new Error("Request body is empty or invalid.");
  }
  if (!Array.isArray(Clients)) {
    Clients = [Clients];
  }
  // Clients = Clients.map((client) => ({
  //   ...client,
  //   user_id: req.user.user.id,
  // }));
  let createdClients;

  if (Clients.length > 1) {
    createdClients = await Client.bulkCreate(Clients);
  } else {
    createdClients = await Client.create(Clients[0]);
  }

  res
    .status(200)
    .json({ message: "Client(s) added successfully.", createdClients });
});

//@desc Fetch all clients
//@route GET /Clients
//@access Public
export const getClients = asyncHandler(async (req, res, next) => {
  const clients = await Client.findAll({
    // where: {
    //   user_id: req.user.user.id,
    // },
  });
  res.status(200).json(clients);
});

//@desc Fetch a single client
//@route GET /Clients/:id
//@access Public
export const getClientById = asyncHandler(async (req, res, next) => {
  const client = await Client.findByPk(req.params.id);
  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }
  // if (client.user_id.toString() !== req.user.user.id) {
  //   res.status(403);
  //   throw new Error(
  //     "User does not have permission to read other User's Clients."
  //   );
  // }
  res.status(200).json(client);
});

//@desc Update a client
//@route PATCH /Clients/:id
//@access Public
export const updateClient = asyncHandler(async (req, res, next) => {
  const client = await Client.findByPk(req.params.id);
  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }
  // if (client.user_id.toString() !== req.user.user.id) {
  //   res.status(403);
  //   throw new Error(
  //     "User does not have permission to update other User's Clients."
  //   );
  // }
  await client.update(req.body);
  res.status(200).json({ message: "Client Updated Successfully..", client });
});

//@desc Delete a client
//@route DELETE /Clients/:id
//@access Public
export const deleteClient = asyncHandler(async (req, res, next) => {
  const client = await Client.findByPk(req.params.id);
  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }
  // if (client.user_id.toString() !== req.user.user.id) {
  //   res.status(403);
  //   throw new Error(
  //     "User does not have permission to delete other User's Clients."
  //   );
  // }
  await client.destroy();
  res.status(200).json({ message: "Client deleted successfully", client });
});
