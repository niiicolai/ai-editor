/**
 * Exposes a set of Electron IPC functionalities to the renderer process via the `contextBridge`.
 * Provides methods for interacting with the file system, executing terminal commands, managing windows,
 * and handling embedded files, among other features.
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    openFolder: () => ipcRenderer.send('open-folder'),
    onOpenFolder: (callback) => ipcRenderer.on('on-open-folder', (event, path) => callback(path)),
    
    openFile: () => ipcRenderer.send('open-file'),
    onOpenFile: (callback) => ipcRenderer.on('on-open-file', (event, path) => callback(path)),

    saveAs: (defaultPath, content) => ipcRenderer.send('save-as', defaultPath, content),
    onSaveAs: (callback) => ipcRenderer.on('on-save-as', (event, result) => callback(result)),
    
    readDirectory: (path) => ipcRenderer.send('read-directory', path),
    onReadDirectory: (callback) => ipcRenderer.on('on-read-directory', (event, files) => callback(files)),    
    
    readFile: (path) => ipcRenderer.send('read-file', path),
    onReadFile: (callback) => ipcRenderer.on('on-read-file', (event, content) => callback(content)),
    
    writeFile: (path, content) => ipcRenderer.send('write-file', path, content),
    onWriteFile: (callback) => ipcRenderer.send('on-write-file', (event) => callback()),
    
    writeDir: (path) => ipcRenderer.send('write-dir', path),
    onWriteDir: (callback) => ipcRenderer.send('on-write-dir', (event, dirPath) => callback(dirPath)),
    
    renameDirectory: (dirPath, newName) => ipcRenderer.send('rename-directory', dirPath, newName),
    onRenameDirectory: (callback) => ipcRenderer.on('on-rename-directory', (event, result) => callback(result)),

    renameFile: (filePath, newName) => ipcRenderer.send('rename-file', filePath, newName),
    onRenameFile: (callback) => ipcRenderer.on('on-rename-file', (event, result) => callback(result)),

    moveItemToTrash: (path) => ipcRenderer.send('move-item-to-trash', path),
    onMoveItemToTrash: (callback) => ipcRenderer.on('on-move-item-to-trash', (event, result) => callback(result)),

    search: (path, pattern) => ipcRenderer.send('search', path, pattern),
    onSearchComplete: (callback) => ipcRenderer.send('on-search-complete', (event, content) => callback(content)),
    
    terminalCmd: (cmd) => ipcRenderer.send('terminal-cmd', cmd),
    onTerminalCmd: (callback) => ipcRenderer.on('on-terminal-cmd', (event, content) => callback(content)),
    
    openExternalBrowser: (url) => ipcRenderer.send('open-external-browser', url),

    revealInExplorer: (path) => ipcRenderer.send('reveal-in-explorer', path),

    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    restoreWindow: () => ipcRenderer.send('restore-window'),
    closeWindow: () => ipcRenderer.send('close-window'),

    insertEmbeddedFile: (body) => ipcRenderer.send('insert-embedded-file', body),
    onInsertEmbeddedFile: (callback) => ipcRenderer.on('on-insert-embedded-file', (event, content) => callback(content)),

    updateEmbeddedFile: (id, body) => ipcRenderer.send('update-embedded-file', id, body),
    onUpdateEmbeddedFile: (callback) => ipcRenderer.on('on-update-embedded-file', (event, content) => callback(content)),

    deleteEmbeddedFile: (id, body) => ipcRenderer.send('delete-embedded-file', id, body),
    onDeleteEmbeddedFile: (callback) => ipcRenderer.on('on-delete-embedded-file', (event, content) => callback(content)),

    deleteAllEmbeddedFiles: (project_id) => ipcRenderer.send('delete-all-embedded-files', project_id),
    onDeleteAllEmbeddedFiles: (callback) => ipcRenderer.on('on-delete-all-embedded-files', (event, content) => callback(content)),

    vectorSearchEmbeddedFiles: (project_id, queryEmbedding) => ipcRenderer.send('vector-search-embedded-files', project_id, queryEmbedding),
    onVectorSearchEmbeddedFiles: (callback) => ipcRenderer.on('on-vector-search-embedded-files', (event, content) => callback(content)),

    textSearchEmbeddedFiles: (project_id, query) => ipcRenderer.send('text-search-embedded-files', project_id, query),
    onVectorSearchEmbeddedFiles: (callback) => ipcRenderer.on('on-text-search-embedded-files', (event, content) => callback(content)),

    paginateEmbeddedFiles: (page, limit, project_id) => ipcRenderer.send('paginate-embedded-files', page, limit, project_id),
    onPaginateEmbeddedFiles: (callback) => ipcRenderer.on('on-paginate-embedded-files', (event, content) => callback(content)),
});
