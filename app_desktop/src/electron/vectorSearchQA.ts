export const vectorSearchQA = (project_id: string, queryEmbedding: number[], embeddingModel: string) => {
  return new Promise<any>((resolve) => {
    window.electron.vectorSearchQA(project_id, queryEmbedding, embeddingModel);
    window.electron.onVectorSearchQA((content: any) => {
      resolve(content);
    });
  });
};
