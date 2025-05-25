export const paginateQA = (page: number, limit: number, project_id: string, embeddingModel: string) => {
  return new Promise<any>((resolve) => {
    window.electron.paginateQA(page, limit, project_id, embeddingModel);
    window.electron.onPaginateQA((content: any) => {
      resolve(content);
    });
  });
};
