export const writeFile = (path: string, content: string) => {
  return new Promise<string | null>((resolve) => {
    window.electron.writeFile(path, content);
    /*window.electron.onWriteFile(() => {
              resolve("");
          });*/
    resolve("");
  });
};
