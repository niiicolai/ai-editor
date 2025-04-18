import { createServer } from "vite";
import { app, BrowserWindow, ipcMain, dialog, session } from "electron";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";
import unzipper from "unzipper";
import { execFile } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createWindow() {
  const vite = await createServer({
    server: { base: "./" },
  });

  await vite.listen();

  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    resizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      preload: `${__dirname}/preload.cjs`,
    },
  });

  // Load the Vite app URL
  mainWindow.loadURL(`http://localhost:${vite.config.server.port}`);

  // IPC Handlers
  ipcMain.on("open-folder", async (event) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    });
    event.reply('on-open-folder', result.filePaths[0]);
  });

  ipcMain.on("read-directory", async (event, dirPath) => {
    try {
      const files = fs.readdirSync(dirPath);
      const fileInfo = files.map(file => {
        const fullPath = path.join(dirPath, file);
        const stats = fs.statSync(fullPath);
        return {
          name: file,
          path: fullPath,
          isDirectory: stats.isDirectory()
        };
      });
      event.reply('on-read-directory', fileInfo);
    } catch (error) {
      console.error('Error reading directory:', error);
      event.reply('on-read-directory', []);
    }
  });

  ipcMain.on("read-file", async (event, filePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      event.reply('on-read-file', content);
    } catch (error) {
      console.error('Error reading file:', error);
      event.reply('on-read-file', null);
    }
  });

  // Open the DevTools.
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