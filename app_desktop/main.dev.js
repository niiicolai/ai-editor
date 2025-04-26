import { createServer } from "vite";
import { app, BrowserWindow, ipcMain, dialog, session, shell } from "electron";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";
import unzipper from "unzipper";
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createWindow() {
  const vite = await createServer({
    server: { base: "./" },
  });

  await vite.listen();

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    resizable: true,
    autoHideMenuBar: true,
    frame: false,
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
  ipcMain.on("minimize-window", async (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) window.minimize();
  });
  ipcMain.on("restore-window", async (event) => {
    const window =
      BrowserWindow.getFocusedWindow() ||
      BrowserWindow.fromWebContents(event.sender);
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize(); // goes back to previous size before maximize
      } else {
        window.maximize(); // fills the screen
      }
    }
  });
  ipcMain.on("close-window", async (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) window.close();
  });

  ipcMain.on("open-folder", async (event) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });
    event.reply("on-open-folder", result.filePaths[0]);
  });

  ipcMain.on("read-directory", async (event, dirPath) => {
    try {
      const files = fs.readdirSync(dirPath);
      const fileInfo = files.map((file) => {
        const fullPath = path.join(dirPath, file);
        const stats = fs.statSync(fullPath);
        return {
          name: file,
          path: fullPath,
          isDirectory: stats.isDirectory(),
        };
      });
      event.reply("on-read-directory", fileInfo);
    } catch (error) {
      console.error("Error reading directory:", error);
      event.reply("on-read-directory", []);
    }
  });

  ipcMain.on("read-file", async (event, filePath) => {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      event.reply("on-read-file", content);
    } catch (error) {
      console.error("Error reading file:", error);
      event.reply("on-read-file", null);
    }
  });

  ipcMain.on("write-file", async (event, filePath, content) => {
    try {
      const result = fs.writeFileSync(filePath, content, "utf8");
      event.reply("on-write-file", result);
    } catch (error) {
      console.error("Error writing file:", error);
      event.reply("on-write-file", null);
    }
  });

  ipcMain.on("write-dir", async (event, dirPath) => {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      event.reply("on-write-dir", dirPath);
    } catch (error) {
      console.error("Error writing dir:", error);
      event.reply("on-write-dir", null);
    }
  });

  ipcMain.on("terminal-cmd", async (event, cmd) => {
    // Validate the command is safe to execute
    if (!cmd || typeof cmd !== "string") {
      event.reply("on-terminal-cmd", "Invalid command");
      return;
    }

    // List of allowed commands or patterns
    const allowedCommands = [
      /^git\s+/,
      /^npm\s+/,
      /^yarn\s+/,
      /^cd\s+/,
      /^ls\s*/,
      /^dir\s*/,
      /^pwd\s*/,
      /^grep\s*/,
      /^powershell\s*/,
    ];

    // Check if the command matches any allowed pattern
    const isAllowed = allowedCommands.some((pattern) => pattern.test(cmd));
    if (!isAllowed) {
      event.reply("on-terminal-cmd", "Command not allowed");
      return;
    }

    try {
      const content = await new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
          if (error) {
            reject({ message: error.message, code: error.code });
            return;
          }
          resolve(`${stdout} ${stderr}`);
        });
      });

      event.reply("on-terminal-cmd", content);
    } catch (error) {
      console.error("Error executing terminal cmd:", error);
      event.reply(
        "on-terminal-cmd",
        error.message || "Command execution failed"
      );
    }
  });

  ipcMain.on("open-external-browser", async (event, url) => {
    try {
      shell.openExternal(url);
    } catch (error) {
      console.error("Error opening external browser:", error);
    }
  });

  ipcMain.on("search", async (event, searchPath, patternStr) => {
    console.log(searchPath, patternStr);
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
