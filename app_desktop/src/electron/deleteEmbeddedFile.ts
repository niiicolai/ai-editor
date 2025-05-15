export const deleteEmbeddedFile = (id: number) => {
  return new Promise<any>((resolve) => {
    window.electron.deleteEmbeddedFile(id);
    window.electron.onDeleteEmbeddedFile((content: any) => {
      resolve(content);
    });
  });
};
