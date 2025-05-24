export const deleteQA = (id: number, embeddingModel: string) => {
  return new Promise<any>((resolve) => {
    window.electron.deleteQA(id, embeddingModel);
    window.electron.onDeleteQA((content: any) => {
      resolve(content);
    });
  });
};
