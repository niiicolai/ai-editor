export const paginateQA = (page: number, limit: number, file_id: string, embeddingModel: string) => {
  return new Promise<any>((resolve) => {
    window.electron.paginateQA(page, limit, file_id, embeddingModel);
    window.electron.onPaginateQA((content: any) => {
      resolve(content);
    });
  });
};
