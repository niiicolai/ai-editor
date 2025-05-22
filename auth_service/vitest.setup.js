import 'dotenv/config';
import { mongoConnect } from "./src/mongodb/index";

process.env.NODE_ENV = 'test';
await mongoConnect();
