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
      };
    }
  }