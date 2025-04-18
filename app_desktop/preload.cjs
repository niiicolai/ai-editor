const { contextBridge, ipcRenderer } = require('electron');

// Expose only the ipcRenderer functionality needed
contextBridge.exposeInMainWorld('electron', {
    openFolder: () => ipcRenderer.send('open-folder'),
    onOpenFolder: (callback) => ipcRenderer.on('on-open-folder', (event, path) => callback(path)),
    readDirectory: (path) => ipcRenderer.send('read-directory', path),
    onReadDirectory: (callback) => ipcRenderer.on('on-read-directory', (event, files) => callback(files)),
    readFile: (path) => ipcRenderer.send('read-file', path),
    onReadFile: (callback) => ipcRenderer.on('on-read-file', (event, content) => callback(content))
});
