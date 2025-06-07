const { app, BrowserWindow } = require("electron");
const path = require("path");
const { browserIpc } = require("./electron_main/ipc/browser_ipc.cjs");
const { embeddedFileIpc } = require("./electron_main/ipc/embedded_file_ipc.cjs");
const { fileIpc } = require("./electron_main/ipc/file_ipc.cjs");
const { qaIpc } = require("./electron_main/ipc/qa_ipc.cjs");
const { terminalIpc } = require("./electron_main/ipc/terminal_ipc.cjs");
const { windowIpc } = require("./electron_main/ipc/window_ipc.cjs");

function createWindow() {
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
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));

  browserIpc(mainWindow);
  embeddedFileIpc(mainWindow);
  fileIpc(mainWindow);
  qaIpc(mainWindow);
  terminalIpc(mainWindow);
  windowIpc(mainWindowSize, mainWindow);
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
