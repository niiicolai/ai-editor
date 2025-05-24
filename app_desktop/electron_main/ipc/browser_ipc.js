import { ipcMain, shell } from "electron";

export const browserIpc = (mainWindow) => {
  ipcMain.on("open-external-browser", async (event, url) => {
    try {
      shell.openExternal(url);
    } catch (error) {
      console.error("Error opening external browser:", error);
    }
  });
};
