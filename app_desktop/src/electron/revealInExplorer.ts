export const revealInExplorer = (filePath: string) => {
  return new Promise<any>((resolve) => {
    window.electron.revealInExplorer(filePath);
    resolve(true);
  });
};
