import "dotenv/config";
import { mongoConnect } from "./src/mongodb/index.js";
import { setupControllers } from "./src/controllers/index.js";
import { setupRabbitMq } from "./src/rabbitmq/index.js";
import { setupSwagger } from "./src/controllers/swagger/swagger_controller.js";
import { GmailService } from "./src/services/gmail_service.js";
import express from "express";
import cors from "cors";

mongoConnect()
  .then(async () => {
    const app = express();
    const PORT = process.env.WEB_PORT || 3006;

    app.use(cors({ origin: "*" }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    setupControllers(app);
    setupSwagger(app);
    setupRabbitMq();
    GmailService.loadAuth();

    app.listen(PORT, () => {
      console.log("INFO: MongoDB connected successfully");
      console.log(`INFO: Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("ERROR: MongoDB connection failed", error);
  });
