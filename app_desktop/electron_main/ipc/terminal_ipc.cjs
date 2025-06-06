const { ipcMain } = require('electron');
const { Worker } = require('worker_threads');
const path = require('path');


const terminalIpc = (mainWindow) => {
  ipcMain.on("terminal-cmd", async (event, cmd) => {
      const worker = new Worker(path.join(__dirname, "../workers/executeTerminalCmdWorker.js"), {
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
};

module.exports = {
  terminalIpc
};
