export const updateQA = (id: string, body: any, embeddingModel: string) => {
  return new Promise<any>((resolve) => {
    window.electron.updateQA(id, body, embeddingModel);
    window.electron.onUpdateQA((content: any) => {
      resolve(content);
    });
  });
};
