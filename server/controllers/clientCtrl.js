// import { Client } from "../models/Client.js";
// import asyncHandler from "express-async-handler";
import { Op } from "sequelize";

// //@desc  Add a new Client or multiple clients
// //@route POST /api/clients
// //@access Public
// export const createClients = asyncHandler(async (req, res, next) => {
//   var clients = req.body;
//   if (!clients || (Array.isArray(clients) && clients.length === 0)) {
//     res.status(400);
//     throw new Error("Request body is empty or invalid.");
//   }
//   if (!Array.isArray(clients)) {
//     clients = [clients];
//   }

//   let createdClients;

//   try {
//     if (clients.length > 1) {
//       // For bulk creation, use bulkCreate with updateOnDuplicate option
//       createdClients = await Client.bulkCreate(clients, {
//         updateOnDuplicate: ["industry", "location", "contact_person", "contact_email", "contact_phone", "status", "compliance_settings"],
//         fields: ["client_name", "industry", "location", "contact_person", "contact_email", "contact_phone", "status", "compliance_settings"],
//       });
//     } else {
//       // For single client, use create or update
//       const [client, created] = await Client.findOrCreate({
//         where: { client_name: clients[0].client_name },
//         defaults: clients[0],
//       });

//       if (!created) {
//         await client.update(clients[0]);
//       }

//       createdClients = [client];
//     }

//     res.status(200).json({ message: "Client(s) added or updated successfully.", createdClients });
//   } catch (error) {
//     res.status(400);
//     throw new Error(`Error creating or updating clients: ${error.message}`);
//   }
// });

// //@desc Fetch all clients with search and filter
// //@route GET /api/clients
// //@access Public
// export const getClients = asyncHandler(async (req, res, next) => {
//   const { search, status } = req.query;
//   const clients = await Client.searchClients(search, status);
//   res.status(200).json(clients);
// });

// //@desc Fetch a single client
// //@route GET /api/clients/:id
// //@access Public
// export const getClientById = asyncHandler(async (req, res, next) => {
//   const client = await Client.findByPk(req.params.id);
//   if (!client) {
//     res.status(404);
//     throw new Error("Client not found");
//   }
//   res.status(200).json(client);
// });

// //@desc Update a client
// //@route PATCH /api/clients/:id
// //@access Public
// export const updateClient = asyncHandler(async (req, res, next) => {
//   const client = await Client.findByPk(req.params.id);
//   if (!client) {
//     res.status(404);
//     throw new Error("Client not found");
//   }
//   await client.update(req.body);
//   res.status(200).json({ message: "Client Updated Successfully.", client });
// });

// //@desc Delete a client
// //@route DELETE /api/clients/:id
// //@access Public
// export const deleteClient = asyncHandler(async (req, res, next) => {
//   const client = await Client.findByPk(req.params.id);
//   if (!client) {
//     res.status(404);
//     throw new Error("Client not found");
//   }
//   await client.destroy();
//   res.status(200).json({ message: "Client deleted successfully", client });
// });

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

export const searchClients = asyncHandler(async (req, res, next) => {
  const { search } = req.params; // Extract search query from URL
  console.log(req.params);
  if (!search) {
    res.status(400);
    throw new Error("Search query is required");
  }

  // Search in multiple fields using Sequelize "OR" condition
  const clients = await Client.findAll({
    where: {
      [Op.or]: [
        { client_name: { [Op.like]: `%${search}%` } }, // Case-insensitive search
        { industry: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ]
    }
  });

  if (!clients.length) {
    res.status(404);
    throw new Error("No clients found");
  }

  res.status(200).json(clients);
});