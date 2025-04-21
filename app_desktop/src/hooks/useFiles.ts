import { useQuery } from '@tanstack/react-query';

declare global {
    interface Window {
        electron: {
            openFolder: () => void;
            onOpenFolder: (callback: (path: string) => void) => void;
            readDirectory: (path: string) => void;
            onReadDirectory: (callback: (files: Array<{ name: string; path: string; isDirectory: boolean }>) => void) => void;
            readFile: (path: string) => void;
            onReadFile: (callback: (content: string | null) => void) => void;
            terminalCmd: (cmd: string) => void;
            onTerminalCmd: (callback: (response: string) => void) => void;
            openExternalBrowser: (url: string) => void;
            writeFile: (path: string, content: string) => void;
            onWriteFile: (callback: () => void) => void;
            writeDir: (path: string) => void;
            onWriteDir: (callback: () => void) => void;
            search: (path: string, pattern: string) => void;
            onSearchComplete: (callback: () => void) => void;
        };
    }
}

const openFolder = () => {
    return new Promise<string>((resolve) => {
        window.electron.openFolder();
        window.electron.onOpenFolder((path: string) => {
            resolve(path);
        });
    });
};

const readDirectory = (path: string) => {
    return new Promise<Array<{ name: string; path: string; isDirectory: boolean }>>((resolve) => {
        window.electron.readDirectory(path);
        window.electron.onReadDirectory((files) => {
            resolve(files);
        });
    });
};

const readFile = (path: string) => {
    return new Promise<string | null>((resolve) => {
        window.electron.readFile(path);
        window.electron.onReadFile((content) => {
            resolve(content);
        });
    });
};

const writeFile = (path: string, content: string) => {
    return new Promise<string | null>((resolve) => {
        window.electron.writeFile(path, content);
        window.electron.onWriteFile(() => {
            resolve("");
        });
    });
};

const writeDir = (path: string) => {
    return new Promise<string | null>((resolve) => {
        window.electron.writeDir(path);
        window.electron.onWriteDir(() => {
            resolve("");
        });
    });
};

const search = (path: string, pattern: string) => {
    return new Promise<string | null>((resolve) => {
        window.electron.search(path, pattern);
        window.electron.onSearchComplete(() => {
            resolve("");
        });
    });
};

export const useFiles = () => {
    const useOpenFolder = () => {
        return useQuery({
            queryKey: ['open-folder'],
            queryFn: openFolder,
            enabled: false // Only runs when manually triggered
        });
    };

    return {
        useOpenFolder,
        readDirectory,
        readFile,
        writeFile,
        writeDir,
        search
    };
};
