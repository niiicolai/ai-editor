import { createServer } from "vite";
import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { browserIpc } from "./electron_main/ipc/browser_ipc.js";
import { embeddedFileIpc } from "./electron_main/ipc/embedded_file_ipc.js";
import { fileIpc } from "./electron_main/ipc/file_ipc.js";
import { qaIpc } from "./electron_main/ipc/qa_ipc.js";
import { terminalIpc } from "./electron_main/ipc/terminal_ipc.js";
import { windowIpc } from "./electron_main/ipc/window_ipc.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createWindow() {
  const vite = await createServer({
    server: { base: "./" },
  });

  await vite.listen();

  let mainWindowSize = { width: 1200, height: 800 };
  const mainWindow = new BrowserWindow({
    width: mainWindowSize.width,
    height: mainWindowSize.height,
    resizable: true,
    autoHideMenuBar: true,
    frame: false,
    icon: path.join(__dirname, "src", "assets", "editorAvatar.png"),
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      preload: `${__dirname}/preload.cjs`,
    },
  });

  // Load the Vite app URL
  mainWindow.loadURL(`http://localhost:${vite.config.server.port}`);

  browserIpc(mainWindow);
  embeddedFileIpc(mainWindow);
  fileIpc(mainWindow);
  qaIpc(mainWindow);
  terminalIpc(mainWindow);
  windowIpc(mainWindowSize, mainWindow);

  if (process.env.NODE_ENV !== "production") {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
