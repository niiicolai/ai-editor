declare global {
  interface Window {
    electron: {
      /**
       * File methods
       */

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

      writeFile: (path: string, content: string) => void;
      onWriteFile: (callback: () => void) => void;

      writeDir: (path: string) => void;
      onWriteDir: (callback: (dirPath: string) => void) => void;

      search: (path: string, pattern: string) => void;
      onSearchComplete: (callback: () => void) => void;

      revealInExplorer: (path: string) => void;

      moveItemToTrash: (path: string) => void;
      onMoveItemToTrash: (callback: () => void) => void;

      fileOrDirExists: (path: string) => void;
      onFileOrDirExists: (callback: (content: any) => void) => void;

      /**
       * Terminal methods
       */
      
      terminalCmd: (cmd: string, cwd: string) => void;
      onTerminalCmd: (callback: (response: string) => void) => void;

      /**
       * Window methods
       */

      minimizeWindow: () => void;
      restoreWindow: () => void;
      closeWindow: () => void;

      /**
       * Browser methods
       */
      
      openExternalBrowser: (url: string) => void;

      /**
       * Embedded files methods
       */

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
      onFindEmbeddedFileByHashAndProjectId: (
        callback: (content: any) => void
      ) => void;

      findEmbeddedFileByFilepathAndProjectId: (
        filepath: string,
        project_id: string,
        embeddingModel: string
      ) => void;
      onFindEmbeddedFileByFilepathAndProjectId: (
        callback: (content: any) => void
      ) => void;

      /**
       * QA methods
       */

      insertQA: (body: any, embeddingModel: string) => void;
      onInsertQA: (callback: (content: any) => void) => void;

      updateQA: (
        id: string,
        body: any,
        embeddingModel: string
      ) => void;
      onUpdateQA: (callback: (content: any) => void) => void;

      deleteQA: (id: number, embeddingModel: string) => void;
      onDeleteQA: (callback: (content: any) => void) => void;

      deleteAllQA: (
        project_id: string,
        embeddingModel: string
      ) => void;
      onDeleteAllQA: (callback: (content: any) => void) => void;

      deleteAllQAByFileId: (
        file_id: string,
        embeddingModel: string
      ) => void;
      onDeleteAllQAByFileId: (callback: (content: any) => void) => void;

      vectorSearchQA: (
        file_id: string,
        queryEmbedding: number[],
        embeddingModel: string
      ) => void;
      onVectorSearchQA: (callback: (content: any) => void) => void;

      textSearchQA: (
        file_id: string,
        query: string,
        embeddingModel: string
      ) => void;
      onTextSearchQA: (callback: (content: any) => void) => void;

      paginateQA: (
        page: number,
        limit: number,
        project_id: string,
        embeddingModel: string
      ) => void;
      onPaginateQA: (callback: (content: any) => void) => void;
    };
  }
}
