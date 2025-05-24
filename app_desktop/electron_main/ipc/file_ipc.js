import { ipcMain, dialog, shell } from "electron";
import { Worker } from "worker_threads";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const fileIpc = (mainWindow) => {
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
      const worker = new Worker(
        path.join(__dirname, "../workers/writeFileWorker.js"),
        {
          workerData: { filePath: result.filePath, content },
        }
      );

      worker.on("message", (msg) => {
        event.reply("on-save-as", { success: true, filePath: result.filePath });
      });

      worker.on("error", (err) => {
        console.error("Worker error:", err);
        event.reply("on-save-as", { success: false, error: err.message });
      });

      worker.on("exit", (code) => {
        if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
      });
    } else {
      event.reply("on-save-as", { success: false, canceled: true });
    }
  });

  ipcMain.on("read-directory", async (event, dirPath) => {
    const worker = new Worker(
      path.join(__dirname, "../workers/readDirectoryWorker.js"),
      {
        workerData: { dirPath },
      }
    );

    worker.on("message", (msg) => {
      event.reply("on-read-directory", msg.data);
    });

    worker.on("error", (err) => {
      console.error("Worker error:", err);
      event.reply("on-read-directory", []);
    });

    worker.on("exit", (code) => {
      if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
    });
  });

  ipcMain.on("read-file", async (event, filePath) => {
    const worker = new Worker(
      path.join(__dirname, "../workers/readFileWorker.js"),
      {
        workerData: { filePath },
      }
    );

    worker.on("message", (msg) => {
      event.reply("on-read-file", msg.data);
    });

    worker.on("error", (err) => {
      console.error("Worker error:", err);
      event.reply("on-read-file", "");
    });

    worker.on("exit", (code) => {
      if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
    });
  });

  ipcMain.on("write-file", async (event, filePath, content) => {
    const worker = new Worker(
      path.join(__dirname, "../workers/writeFileWorker.js"),
      {
        workerData: { filePath, content },
      }
    );

    worker.on("message", (msg) => {
      event.reply("on-write-file", msg.data);
    });

    worker.on("error", (err) => {
      console.error("Worker error:", err);
      event.reply("on-write-file", {});
    });

    worker.on("exit", (code) => {
      if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
    });
  });

  ipcMain.on("write-dir", async (event, dirPath) => {
    const worker = new Worker(
      path.join(__dirname, "../workers/writeDirWorker.js"),
      {
        workerData: { dirPath },
      }
    );

    worker.on("message", (msg) => {
      event.reply("on-write-dir", msg.data);
    });

    worker.on("error", (err) => {
      console.error("Worker error:", err);
      event.reply("on-write-dir", "");
    });

    worker.on("exit", (code) => {
      if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
    });
  });

  ipcMain.on("rename-directory", async (event, dirPath, newName) => {
    const worker = new Worker(
      path.join(__dirname, "../workers/renameDirWorker.js"),
      {
        workerData: { dirPath, newName },
      }
    );

    worker.on("message", (msg) => {
      event.reply("on-rename-directory", msg.data);
    });

    worker.on("error", (err) => {
      console.error("Worker error:", err);
      event.reply("on-rename-directory", err);
    });

    worker.on("exit", (code) => {
      if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
    });
  });

  ipcMain.on("rename-file", async (event, filePath, newName) => {
    const worker = new Worker(
      path.join(__dirname, "../workers/renameFileWorker.js"),
      {
        workerData: { filePath, newName },
      }
    );

    worker.on("message", (msg) => {
      event.reply("on-rename-file", msg.data);
    });

    worker.on("error", (err) => {
      console.error("Worker error:", err);
      event.reply("on-rename-file", err);
    });

    worker.on("exit", (code) => {
      if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
    });
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
      const worker = new Worker(
        path.join(__dirname, "../workers/moveItemToTrashWorker.js"),
        {
          workerData: { path: _path },
        }
      );

      worker.on("message", (msg) => {
        event.reply("on-move-item-to-trash", msg.data);
      });

      worker.on("error", (err) => {
        console.error("Worker error:", err);
        event.reply("on-move-item-to-trash", err);
      });

      worker.on("exit", (code) => {
        if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
      });
    } catch (error) {
      console.error("Error moving item to trash:", error);
    }
  });

  ipcMain.on("search", async (event, searchPath, patternStr) => {
    console.log(searchPath, patternStr);
  });
};
