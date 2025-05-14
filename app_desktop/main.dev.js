import { createServer } from "vite";
import { app, BrowserWindow, ipcMain, dialog, session, shell } from "electron";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";
import unzipper from "unzipper";
import { exec } from "child_process";
import { Worker } from "worker_threads";
import { 
  insertEmbeddedFile,
  updateEmbeddedFile, 
  deleteEmbeddedFile, 
  deleteAllEmbeddedFiles, 
  vectorSearchEmbeddedFiles, 
  textSearchEmbeddedFiles, 
  paginateEmbeddedFiles, 
} from "./src/sqlite/index.js";

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
    icon: path.join(__dirname, "src", "assets", "editorAvatar.png"), // Set the icon here
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      preload: `${__dirname}/preload.cjs`,
    },
  });

  // Load the Vite app URL
  mainWindow.loadURL(`http://localhost:${vite.config.server.port}`);

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
        window.unmaximize(mainWindowSize); // goes back to previous size before maximize
      } else {
        mainWindowSize = { width: window.width, height: window.height }
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

  ipcMain.on("open-file", async (event) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openFile"],
    });
    event.reply("on-open-file", result.filePaths[0]);
  });

  ipcMain.on("save-as", async (event, defaultPath, content) => {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: "Save As",
      defaultPath,
      filters: [
        { name: "Text Files", extensions: ["txt"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (!result.canceled && result.filePath) {
        const worker = new Worker(path.join(__dirname, "./src/workers/writeFileWorker.js"), {
          workerData: { filePath: result.filePath, content },
        });
      
        worker.on("message", (msg) => {
          event.reply("on-save-as", { success: true, filePath: result.filePath });
        });
      
        worker.on("error", (err) => {
          console.error("Worker error:", err);
          event.reply("on-save-as", { success: false, error: err.message });
        });
      
        worker.on("exit", (code) => {
          if (code !== 0)
            console.error(`Worker stopped with exit code ${code}`);
        });
    } else {
      event.reply("on-save-as", { success: false, canceled: true });
    }
  });

  ipcMain.on("read-directory", async (event, dirPath) => {
    const worker = new Worker(path.join(__dirname, "./src/workers/readDirectoryWorker.js"), {
      workerData: { dirPath },
    });
  
    worker.on("message", (msg) => {
      event.reply("on-read-directory", msg.data);
    });
  
    worker.on("error", (err) => {
      console.error("Worker error:", err);
      event.reply("on-read-directory", []);
    });
  
    worker.on("exit", (code) => {
      if (code !== 0)
        console.error(`Worker stopped with exit code ${code}`);
    });
  });

  ipcMain.on("read-file", async (event, filePath) => {
    const worker = new Worker(path.join(__dirname, "./src/workers/readFileWorker.js"), {
      workerData: { filePath },
    });
  
    worker.on("message", (msg) => {
      event.reply("on-read-file", msg.data);
    });
  
    worker.on("error", (err) => {
      console.error("Worker error:", err);
      event.reply("on-read-file", "");
    });
  
    worker.on("exit", (code) => {
      if (code !== 0)
        console.error(`Worker stopped with exit code ${code}`);
    });
  });

  ipcMain.on("write-file", async (event, filePath, content) => {
    const worker = new Worker(path.join(__dirname, "./src/workers/writeFileWorker.js"), {
      workerData: { filePath, content },
    });
  
    worker.on("message", (msg) => {
      event.reply("on-write-file", msg.data);
    });
  
    worker.on("error", (err) => {
      console.error("Worker error:", err);
      event.reply("on-write-file", {});
    });
  
    worker.on("exit", (code) => {
      if (code !== 0)
        console.error(`Worker stopped with exit code ${code}`);
    });
  });

  ipcMain.on("write-dir", async (event, dirPath) => {
    const worker = new Worker(path.join(__dirname, "./src/workers/writeDirWorker.js"), {
      workerData: { dirPath },
    });
  
    worker.on("message", (msg) => {
      event.reply("on-write-dir", msg.data);
    });
  
    worker.on("error", (err) => {
      console.error("Worker error:", err);
      event.reply("on-write-dir", "");
    });
  
    worker.on("exit", (code) => {
      if (code !== 0)
        console.error(`Worker stopped with exit code ${code}`);
    });
  });

  ipcMain.on("rename-directory", async (event, dirPath, newName) => {
    const worker = new Worker(path.join(__dirname, "./src/workers/renameDirWorker.js"), {
      workerData: { dirPath, newName },
    });
  
    worker.on("message", (msg) => {
      event.reply("on-rename-directory", msg.data);
    });
  
    worker.on("error", (err) => {
      console.error("Worker error:", err);
      event.reply("on-rename-directory", err);
    });
  
    worker.on("exit", (code) => {
      if (code !== 0)
        console.error(`Worker stopped with exit code ${code}`);
    });
  });

  ipcMain.on("rename-file", async (event, filePath, newName) => {
    const worker = new Worker(path.join(__dirname, "./src/workers/renameFileWorker.js"), {
      workerData: { filePath, newName },
    });
  
    worker.on("message", (msg) => {
      event.reply("on-rename-file", msg.data);
    });
  
    worker.on("error", (err) => {
      console.error("Worker error:", err);
      event.reply("on-rename-file", err);
    });
  
    worker.on("exit", (code) => {
      if (code !== 0)
        console.error(`Worker stopped with exit code ${code}`);
    });
  });

  ipcMain.on("terminal-cmd", async (event, cmd) => {
    const worker = new Worker(path.join(__dirname, "./src/workers/executeTerminalCmdWorker.js"), {
      workerData: { cmd },
    });
  
    worker.on("message", (msg) => {
      event.reply("on-terminal-cmd", msg.data);
    });
  
    worker.on("error", (err) => {
      console.error("Worker error:", err);
      event.reply("on-terminal-cmd", err);
    });
  
    worker.on("exit", (code) => {
      if (code !== 0)
        console.error(`Worker stopped with exit code ${code}`);
    });
  });

  ipcMain.on("open-external-browser", async (event, url) => {
    try {
      shell.openExternal(url);
    } catch (error) {
      console.error("Error opening external browser:", error);
    }
  });

  ipcMain.on("reveal-in-explorer", async (event, filePath) => {
    try {
      shell.showItemInFolder(filePath);
    } catch (error) {
      console.error("Error revealing in explorer:", error);
    }
  });

  ipcMain.on("move-item-to-trash", async (event, _path) => {
    try {
      const worker = new Worker(path.join(__dirname, "./src/workers/moveItemToTrashWorker.js"), {
        workerData: { path: _path },
      });
    
      worker.on("message", (msg) => {
        event.reply("on-move-item-to-trash", msg.data);
      });
    
      worker.on("error", (err) => {
        console.error("Worker error:", err);
        event.reply("on-move-item-to-trash", err);
      });
    
      worker.on("exit", (code) => {
        if (code !== 0)
          console.error(`Worker stopped with exit code ${code}`);
      });
    } catch (error) {
      console.error("Error moving item to trash:", error);
    }
  });

  ipcMain.on("search", async (event, searchPath, patternStr) => {
    console.log(searchPath, patternStr);
  });

  ipcMain.on("insert-embedded-file", async (event, body) => {
    try {
      const insertId = insertEmbeddedFile(body);
      event.reply("on-insert-embedded-file", { success: true, id: insertId });
    } catch (error) {
      console.error("Error inserting embedded file:", error);
      event.reply("on-insert-embedded-file", { success: false, error: error.message });
    }
  });

  ipcMain.on("update-embedded-file", async (event, id, body) => {
    try {
      updateEmbeddedFile(id, body);
      event.reply("on-update-embedded-file", { success: true });
    } catch (error) {
      console.error("Error updating embedded file:", error);
      event.reply("on-update-embedded-file", { success: false, error: error.message });
    }
  });

  ipcMain.on("delete-embedded-file", async (event, id) => {
    try {
      deleteEmbeddedFile(id);
      event.reply("on-delete-embedded-file", { success: true });
    } catch (error) {
      console.error("Error deleting embedded file:", error);
      event.reply("on-delete-embedded-file", { success: false, error: error.message });
    }
  });

  ipcMain.on("delete-all-embedded-files", async (event, id) => {
    try {
      deleteAllEmbeddedFiles(id);
      event.reply("on-delete-all-embedded-files", { success: true });
    } catch (error) {
      console.error("Error deleting all embedded files:", error);
      event.reply("on-delete-all-embedded-files", { success: false, error: error.message });
    }
  });

  ipcMain.on("vector-search-embedded-files", async (event, project_id, queryEmbedding) => {
    try {
      const result = vectorSearchEmbeddedFiles(queryEmbedding, project_id);
      event.reply("on-vector-search-embedded-files", { success: true, result });
    } catch (error) {
      console.error("Error vector searching embedded files:", error);
      event.reply("on-vector-search-embedded-files", { success: false, error: error.message });
    }
  });

  ipcMain.on("text-search-embedded-files", async (event, project_id, query) => {
    try {
      const result = textSearchEmbeddedFiles(query, project_id);
      event.reply("on-text-search-embedded-files", { success: true, result });
    } catch (error) {
      console.error("Error text searching embedded files:", error);
      event.reply("on-text-search-embedded-files", { success: false, error: error.message });
    }
  });

  ipcMain.on("paginate-embedded-files", async (event, page, limit, project_id) => {
    try {
      const result = paginateEmbeddedFiles(page, limit, project_id);
      event.reply("on-paginate-embedded-files", { success: true, result });
    } catch (error) {
      console.error("Error paginate embedded files:", error);
      event.reply("on-paginate-embedded-files", { success: false, error: error.message });
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
