const { app } = require("electron");
const { createDB } = require("./create_db.cjs");
const os = require("os");
const Database = require("better-sqlite3");
const vec = require("sqlite-vec");
const path = require("path");
const isDev = !app?.isPackaged;

const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'editor_db.db');
const db = new Database(dbPath);

if (isDev) {
  vec.load(db);
} else if (os.platform() === "win32" && os.arch() === "x64") {
  db.loadExtension(
    path.join(
      app.getAppPath().replace("app.asar", "app.asar.unpacked"),
      "node_modules/sqlite-vec-windows-x64/vec0.dll"
    )
  );
} else if (os.platform() === "linux" && os.arch() === "x64") {
  db.loadExtension(
    path.join(
      app.getAppPath().replace("app.asar", "app.asar.unpacked"),
      "node_modules/sqlite-vec-linux-x64/vec0.so"
    )
  );
} else if (os.platform() === "darwin" && os.arch() === "x64") {
  db.loadExtension(
    path.join(
      app.getAppPath().replace("app.asar", "app.asar.unpacked"),
      "node_modules/sqlite-vec-darwin-x64/vec0"
    )
  );
} else {
  throw new Error(
    `Unsupported platform: ${os.platform()} ${os.arch()}. Please check the documentation for supported platforms.`
  );
}

createDB(db);

module.exports = {
  db,
};
