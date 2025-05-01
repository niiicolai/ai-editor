export const renameFile = (filePath: string, newName: string) => {
  return new Promise<any>((resolve) => {
    window.electron.renameFile(filePath, newName);
    window.electron.onRenameFile((result: any) => {
      resolve(result);
    });
  });
};
