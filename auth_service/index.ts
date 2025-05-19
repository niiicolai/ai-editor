import "dotenv/config";
import { mongoConnect } from "./src/mongodb/index";
import { setupRabbitMq } from "./src/rabbitmq/index";
import { setupControllers } from "./src/controllers/index";
import { setupCron } from "./src/jobs/index";
import { setupSwagger } from "./src/controllers/swagger/swagger_controller";
import { rateLimit } from 'express-rate-limit'
import express from "express";
import cors from "cors";
import helmet from "helmet";

mongoConnect()
  .then(() => {
    const app: express.Express = express();
    const PORT = process.env.WEB_PORT || 3000;
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
      standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    })

    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(limiter);
    
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
