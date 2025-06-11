/**
 * Exposes a set of Electron IPC functionalities to the renderer process via the `contextBridge`.
 * Provides methods for interacting with the file system, executing terminal commands, managing windows,
 * and handling embedded files, among other features.
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {

    /**
     * File methods
     */

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

    revealInExplorer: (path) => ipcRenderer.send('reveal-in-explorer', path),

    fileOrDirExists: (path) => ipcRenderer.send('file-or-dir-exists', path),
    onFileOrDirExists: (callback) => ipcRenderer.on('on-file-or-dir-exists', (event, content) => callback(content)),

    /**
     * Terminal methods
     */
    
    terminalCmd: (cmd, cwd) => ipcRenderer.send('terminal-cmd', cmd, cwd),
    onTerminalCmd: (callback) => ipcRenderer.on('on-terminal-cmd', (event, content) => callback(content)),

    /**
     * Browser methods
     */
    
    openExternalBrowser: (url) => ipcRenderer.send('open-external-browser', url),

    /**
     * Window methods
     */

    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    restoreWindow: () => ipcRenderer.send('restore-window'),
    closeWindow: () => ipcRenderer.send('close-window'),

    /**
     * Embedded File methods
     */

    findEmbeddedFileByHashAndProjectId: (hash, project_id, embeddingModel) => ipcRenderer.send('find-embedded-file-by-hash-and-project-id', hash, project_id, embeddingModel),
    onFindEmbeddedFileByHashAndProjectId: (callback) => ipcRenderer.on('on-find-embedded-file-by-hash-and-project-id', (event, content) => callback(content)),

    findEmbeddedFileByFilepathAndProjectId: (filepath, project_id, embeddingModel) => ipcRenderer.send('find-embedded-file-by-file-path-and-project-id', filepath, project_id, embeddingModel),
    onFindEmbeddedFileByFilepathAndProjectId: (callback) => ipcRenderer.on('on-find-embedded-file-by-file-path-and-project-id', (event, content) => callback(content)),

    insertEmbeddedFile: (body, embeddingModel) => ipcRenderer.send('insert-embedded-file', body, embeddingModel),
    onInsertEmbeddedFile: (callback) => ipcRenderer.on('on-insert-embedded-file', (event, content) => callback(content)),

    updateEmbeddedFile: (id, body, embeddingModel) => ipcRenderer.send('update-embedded-file', id, body, embeddingModel),
    onUpdateEmbeddedFile: (callback) => ipcRenderer.on('on-update-embedded-file', (event, content) => callback(content)),

    deleteEmbeddedFile: (id, embeddingModel) => ipcRenderer.send('delete-embedded-file', id, embeddingModel),
    onDeleteEmbeddedFile: (callback) => ipcRenderer.on('on-delete-embedded-file', (event, content) => callback(content)),

    deleteAllEmbeddedFiles: (project_id, embeddingModel) => ipcRenderer.send('delete-all-embedded-files', project_id, embeddingModel),
    onDeleteAllEmbeddedFiles: (callback) => ipcRenderer.on('on-delete-all-embedded-files', (event, content) => callback(content)),

    paginateEmbeddedFiles: (page, limit, project_id, embeddingModel) => ipcRenderer.send('paginate-embedded-files', page, limit, project_id, embeddingModel),
    onPaginateEmbeddedFiles: (callback) => ipcRenderer.on('on-paginate-embedded-files', (event, content) => callback(content)),

    /**
     * QA methods
     */

    insertQA: (body, embeddingModel) => ipcRenderer.send('insert-qa', body, embeddingModel),
    onInsertQA: (callback) => ipcRenderer.on('on-insert-qa', (event, content) => callback(content)),

    updateQA: (id, body, embeddingModel) => ipcRenderer.send('update-qa', id, body, embeddingModel),
    onUpdateQA: (callback) => ipcRenderer.on('on-update-qa', (event, content) => callback(content)),

    deleteQA: (id, embeddingModel) => ipcRenderer.send('delete-qa', id, embeddingModel),
    onDeleteQA: (callback) => ipcRenderer.on('on-delete-qa', (event, content) => callback(content)),

    deleteAllQA: (project_id, embeddingModel) => ipcRenderer.send('delete-all-qa', project_id, embeddingModel),
    onDeleteAllQA: (callback) => ipcRenderer.on('on-delete-all-qa', (event, content) => callback(content)),

    deleteAllQAByFileId: (file_id, embeddingModel) => ipcRenderer.send('delete-all-qa-by-file-id', file_id, embeddingModel),
    onDeleteAllQAByFileId: (callback) => ipcRenderer.on('on-delete-all-qa-by-file-id', (event, content) => callback(content)),

    vectorSearchQA: (project_id, queryEmbedding, embeddingModel) => ipcRenderer.send('vector-search-qa', project_id, queryEmbedding, embeddingModel),
    onVectorSearchQA: (callback) => ipcRenderer.on('on-vector-search-qa', (event, content) => callback(content)),

    textSearchQA: (project_id, query, embeddingModel) => ipcRenderer.send('text-search-qa', project_id, query, embeddingModel),
    onTextSearchQA: (callback) => ipcRenderer.on('on-text-search-qa', (event, content) => callback(content)),

    paginateQA: (page, limit, project_id, embeddingModel) => ipcRenderer.send('paginate-qa', page, limit, project_id, embeddingModel),
    onPaginateQA: (callback) => ipcRenderer.on('on-paginate-qa', (event, content) => callback(content)),
});
