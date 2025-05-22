import 'dotenv/config';
import { mongoConnect, cleanDatabase } from "./src/mongodb/index";

process.env.NODE_ENV = 'test';
await mongoConnect();
await cleanDatabase();
