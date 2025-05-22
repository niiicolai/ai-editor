import "dotenv/config";
import { mongoConnect } from "./src/mongodb/index.js";
import { setupControllers } from "./src/controllers/index.js";
import express from "express";

mongoConnect()
  .then(() => {
    const app = express();
    const PORT = 3000;

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    setupControllers(app);

    app.listen(PORT, () => {
      console.log("INFO: MongoDB connected successfully");
      console.log(`INFO: Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("ERROR: MongoDB connection failed", error);
  });
