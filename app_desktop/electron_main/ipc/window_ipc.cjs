const { ipcMain, BrowserWindow } = require('electron');

const windowIpc = (mainWindowSize, mainWindow) => {

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
        mainWindowSize = { width: window.width, height: window.height };
        window.maximize(); // fills the screen
      }
    }
  });

  ipcMain.on("close-window", async (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) window.close();
  });
};

module.exports = {
  windowIpc
};
