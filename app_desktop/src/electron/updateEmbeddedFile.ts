export const updateEmbeddedFile = (id: string, body: any, embeddingModel: string) => {
  return new Promise<any>((resolve) => {
    window.electron.updateEmbeddedFile(id, body, embeddingModel);
    window.electron.onUpdateEmbeddedFile((content: any) => {
      resolve(content);
    });
  });
};
