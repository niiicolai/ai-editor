export const textSearchQA = (project_id: string, query: string, embeddingModel: string) => {
  return new Promise<any>((resolve) => {
    window.electron.textSearchQA(project_id, query, embeddingModel);
    window.electron.onTextSearchQA((content: any) => {
      resolve(content);
    });
  });
};
