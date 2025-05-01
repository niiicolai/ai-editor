export const saveAs = (defaultPath: string, content: string) => {
  return new Promise<any>((resolve) => {
    window.electron.saveAs(defaultPath, content);
    window.electron.onSaveAs((result) => {
      resolve(result);
    });
  });
};
