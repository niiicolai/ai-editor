export const deleteEmbeddedFile = (id: number, embeddingModel: string) => {
  return new Promise<any>((resolve) => {
    window.electron.deleteEmbeddedFile(id, embeddingModel);
    window.electron.onDeleteEmbeddedFile((content: any) => {
      resolve(content);
    });
  });
};
