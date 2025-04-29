export const writeDir = (path: string) => {
  return new Promise<string | null>(() => {
    window.electron.writeDir(path);
    /*window.electron.onWriteDir((dirPath: string) => {
      resolve(dirPath);
    });*/
  });
};
