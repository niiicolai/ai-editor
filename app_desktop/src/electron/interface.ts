declare global {
  interface Window {
    electron: {
      openFolder: () => void;
      onOpenFolder: (callback: (path: string) => void) => void;

      openFile: () => void;
      onOpenFile: (callback: (path: string) => void) => void;

      saveAs: (defaultPath: string, content: string) => void;
      onSaveAs: (callback: (result: any) => void) => void;

      readDirectory: (path: string) => void;
      onReadDirectory: (
        callback: (
          files: Array<{ name: string; path: string; isDirectory: boolean }>
        ) => void
      ) => void;

      readFile: (path: string) => void;
      onReadFile: (callback: (content: string | null) => void) => void;

      renameDirectory: (dirPath: string, newName: string) => void;
      onRenameDirectory: (callback: (result: any) => void) => void;

      renameFile: (filePath: string, newName: string) => void;
      onRenameFile: (callback: (result: any) => void) => void;

      terminalCmd: (cmd: string) => void;
      onTerminalCmd: (callback: (response: string) => void) => void;

      openExternalBrowser: (url: string) => void;

      writeFile: (path: string, content: string) => void;
      onWriteFile: (callback: () => void) => void;

      writeDir: (path: string) => void;
      onWriteDir: (callback: (dirPath: string) => void) => void;

      search: (path: string, pattern: string) => void;
      onSearchComplete: (callback: () => void) => void;

      revealInExplorer: (path: string) => void;

      moveItemToTrash: (path: string) => void;
      onMoveItemToTrash: (callback: () => void) => void;

      minimizeWindow: () => void;
      restoreWindow: () => void;
      closeWindow: () => void;

      insertEmbeddedFile: (body: any, embeddingModel: string) => void;
      onInsertEmbeddedFile: (callback: (content: any) => void) => void;

      updateEmbeddedFile: (
        id: string,
        body: any,
        embeddingModel: string
      ) => void;
      onUpdateEmbeddedFile: (callback: (content: any) => void) => void;

      deleteEmbeddedFile: (id: number, embeddingModel: string) => void;
      onDeleteEmbeddedFile: (callback: (content: any) => void) => void;

      deleteAllEmbeddedFiles: (
        project_id: string,
        embeddingModel: string
      ) => void;
      onDeleteAllEmbeddedFiles: (callback: (content: any) => void) => void;

      vectorSearchEmbeddedFiles: (
        project_id: string,
        queryEmbedding: number[],
        embeddingModel: string
      ) => void;
      onVectorSearchEmbeddedFiles: (callback: (content: any) => void) => void;

      textSearchEmbeddedFiles: (
        project_id: string,
        query: string,
        embeddingModel: string
      ) => void;
      onTextSearchEmbeddedFiles: (callback: (content: any) => void) => void;

      paginateEmbeddedFiles: (
        page: number,
        limit: number,
        project_id: string,
        embeddingModel: string
      ) => void;
      onPaginateEmbeddedFiles: (callback: (content: any) => void) => void;

      findEmbeddedFileByHashAndProjectId: (
        hash: string,
        project_id: string,
        embeddingModel: string
      ) => void;
      onFindEmbeddedFileByHashAndProjectId: (callback: (content: any) => void) => void;

      findEmbeddedFileByFilepathAndProjectId: (
        filepath: string,
        project_id: string,
        embeddingModel: string
      ) => void;
      onFindEmbeddedFileByFilepathAndProjectId: (callback: (content: any) => void) => void;
    };
  }
}

