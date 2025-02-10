import express from "express";
import bodyparser from "body-parser";
import dotenv from "dotenv";
import { dbConnect, dbSync } from "./config/dbConfig.js";
import { SetupAssociations } from "./config/Association.js";
import { Routers } from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend origin
    methods: "GET,POST,PATCH,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// app.use("/Jobs", Routers.jobRouter);

app.use("/api/clients", Routers.clientRouter);

// app.use("/Users", Routers.userRouter);

app.options("*", cors());

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  dbConnect()
    .then(() => {
      console.log("Database is connected");
      SetupAssociations();
      dbSync()
        .then(() => console.log("Database is connected and synced"))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});
