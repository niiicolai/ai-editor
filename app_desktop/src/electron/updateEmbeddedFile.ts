export const updateEmbeddedFile = (id: string, body: any) => {
  return new Promise<any>((resolve) => {
    window.electron.updateEmbeddedFile(id, body);
    window.electron.onUpdateEmbeddedFile((content: any) => {
      resolve(content);
    });
  });
};
