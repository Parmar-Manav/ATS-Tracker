import express from "express";
import { sequelize } from "./models/index.js";
import clientRoutes from "./routes/clientRoutes.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // Allow frontend origin
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
  }));
app.use("/api/clients", clientRoutes);
app.options("*", cors());

const PORT = process.env.PORT || 5001;

sequelize.sync({ force: false }).then(() => {
  console.log("Database connected and models synced");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(error => console.error("Database connection error:", error));
