const { contextBridge, ipcRenderer } = require('electron');

// Expose only the ipcRenderer functionality needed
contextBridge.exposeInMainWorld('electron', {
    openFolder: () => ipcRenderer.send('open-folder'),
    onOpenFolder: (callback) => ipcRenderer.on('on-open-folder', (event, path) => callback(path)),
    readDirectory: (path) => ipcRenderer.send('read-directory', path),
    onReadDirectory: (callback) => ipcRenderer.on('on-read-directory', (event, files) => callback(files)),
    readFile: (path) => ipcRenderer.send('read-file', path),
    onReadFile: (callback) => ipcRenderer.on('on-read-file', (event, content) => callback(content)),
    writeFile: (path, content) => ipcRenderer.send('write-file', path, content),
    onWriteFile: (callback) => ipcRenderer.send('on-write-file', (event) => callback()),
    writeDir: (path) => ipcRenderer.send('write-dir', path),
    onWriteDir: (callback) => ipcRenderer.send('on-write-dir', (event) => callback()),
    terminalCmd: (cmd) => ipcRenderer.send('terminal-cmd', cmd),
    onTerminalCmd: (callback) => ipcRenderer.on('on-terminal-cmd', (event, content) => callback(content)),
    openExternalBrowser: (url) => ipcRenderer.send('open-external-browser', url),
});
