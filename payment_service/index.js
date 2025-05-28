import "dotenv/config";
import { mongoConnect } from "./src/mongodb/index.js";
import { setupControllers } from "./src/controllers/index.js";
import { setupRabbitMq } from "./src/rabbitmq/index.js";
import { setupCron } from "./src/jobs/index.js";
import { setupSwagger } from "./src/controllers/swagger/swagger_controller.js";
import { rateLimit } from 'express-rate-limit'
import express from "express";
import cors from "cors";
import helmet from "helmet";

mongoConnect()
  .then(() => {
    const app = express();
    const PORT = process.env.WEB_PORT || 3002;
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
      standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    })

    app.use(cors({ origin: '*' }));
    //app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    //app.use(limiter);
    
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
