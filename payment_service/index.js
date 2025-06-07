import "dotenv/config";
import { mongoConnect } from "./src/mongodb/index.js";
import { setupControllers } from "./src/controllers/index.js";
import { setupRabbitMq } from "./src/rabbitmq/index.js";
import { setupCron } from "./src/jobs/index.js";
import { setupSwagger } from "./src/controllers/swagger/swagger_controller.js";
import express from "express";
import cors from "cors";

mongoConnect()
  .then(() => {
    const app = express();
    const PORT = process.env.WEB_PORT || 3002;

    app.use(cors({ origin: '*' }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    setupControllers(app);
    setupSwagger(app);
    setupRabbitMq();
    setupCron();

    app.listen(PORT, () => {
      console.log("INFO: MongoDB connected successfully");
      console.log(`INFO: Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("ERROR: MongoDB connection failed", error);
  });
