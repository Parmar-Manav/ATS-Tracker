import { Client } from "../models/index.js";

// export const createClient = async (req, res) => {
//   try {
//     const client = await Client.create(req.body);
//     res.status(201).json(client);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
// export const createClients = async (req, res) => {
//   try {
//     const clients = req.body; // Ensure this is an array
//     if (!Array.isArray(clients)) {
//       return res.status(400).json({ error: "Invalid data format. Expected an array." });
//     }

//     // Use bulkCreate instead of looping over build().save()
//     const newClients = await Client.bulkCreate(clients, { validate: true });

//     return res.status(201).json(newClients);
//   } catch (error) {
//     console.error("Bulk insert error:", error);
//     return res.status(500).json({ error: "Failed to upload clients" });
//   }
// };
export const createClients = async (req, res, next) => {
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
};

export const getClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });
    await client.update(req.body);
    res.json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });
    await client.destroy();
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
