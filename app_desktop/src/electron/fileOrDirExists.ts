export const fileOrDirExists = (path: string) => {
  return new Promise<any>((resolve) => {
    window.electron.fileOrDirExists(path);
    window.electron.onFileOrDirExists((content: any) => {
      resolve(content);
    });
  });
};
