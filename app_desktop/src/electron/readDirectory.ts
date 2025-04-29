export const readDirectory = (path: string) => {
  return new Promise<
    Array<{ name: string; path: string; isDirectory: boolean }>
  >((resolve) => {
    window.electron.readDirectory(path);
    window.electron.onReadDirectory((files) => {
      const sortedDirectoryFiles = files.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return 0;
      });
      
      resolve(sortedDirectoryFiles);
    });
  });
};
