import 'dotenv/config';
import { mongoConnect } from "./src/mongodb/index.js";

process.env.NODE_ENV = 'test';
await mongoConnect();
