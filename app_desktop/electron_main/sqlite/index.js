import Database from "better-sqlite3";
import * as vec from "sqlite-vec";
import { createDB } from "./create_db.js";

export const db = new Database("editor_db.db");
vec.load(db);
createDB(db);
