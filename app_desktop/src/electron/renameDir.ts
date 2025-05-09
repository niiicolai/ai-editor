export const renameDir = (dirPath: string, newName: string) => {
  return new Promise<any>((resolve) => {
    console.log("Renaming directory:", dirPath, newName);
    window.electron.renameDirectory(dirPath, newName);
    window.electron.onRenameDirectory((result: any) => {
      resolve(result);
    });
  });
};
