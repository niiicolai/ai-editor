export const openFile = () => {
  return new Promise<string>((resolve) => {
    window.electron.openFile();
    window.electron.onOpenFile((path: string) => {
      resolve(path);
    });
  });
};
