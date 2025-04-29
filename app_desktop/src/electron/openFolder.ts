export const openFolder = () => {
  return new Promise<string>((resolve) => {
    window.electron.openFolder();
    window.electron.onOpenFolder((path: string) => {
      resolve(path);
    });
  });
};
