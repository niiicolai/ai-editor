const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');
const { execFile } = require('child_process');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 555,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  // Load the index.html file from the "dist" folder
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));

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
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});