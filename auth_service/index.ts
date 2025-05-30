import "dotenv/config";
import { mongoConnect } from "./src/mongodb/index";
import { setupRabbitMq } from "./src/rabbitmq/index";
import { setupControllers } from "./src/controllers/index";
import { setupCron } from "./src/jobs/index";
import { setupSwagger } from "./src/controllers/swagger/swagger_controller";
import express from "express";
import cors from "cors";

mongoConnect()
  .then(() => {
    const app: express.Express = express();
    const PORT = process.env.WEB_PORT || 3000;

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
