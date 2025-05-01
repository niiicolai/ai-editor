export const renameDir = (dirPath: string, newName: string) => {
  return new Promise<any>((resolve) => {
    window.electron.renameDirectory(dirPath, newName);
    window.electron.onRenameDirectory((result: any) => {
      resolve(result);
    });
  });
};
