export const insertQA = (body: any, embeddingModel: string) => {
  return new Promise<any>((resolve) => {
    window.electron.insertQA(body, embeddingModel);
    window.electron.onInsertQA((content: any) => {
      resolve(content);
    });
  });
};
