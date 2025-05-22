export const insertEmbeddedFile = (body: any, embeddingModel: string) => {
  return new Promise<any>((resolve) => {
    window.electron.insertEmbeddedFile(body, embeddingModel);
    window.electron.onInsertEmbeddedFile((content: any) => {
      resolve(content);
    });
  });
};
