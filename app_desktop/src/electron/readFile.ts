export const readFile = (path: string) => {
  return new Promise<string | null>((resolve) => {
    window.electron.readFile(path);
    window.electron.onReadFile((content) => {
      resolve(content);
    });
  });
};
