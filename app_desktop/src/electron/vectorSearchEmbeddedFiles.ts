export const vectorSearchEmbeddedFiles = (project_id: string, queryEmbedding: number[], embeddingModel: string) => {
  return new Promise<any>((resolve) => {
    window.electron.vectorSearchEmbeddedFiles(project_id, queryEmbedding, embeddingModel);
    window.electron.onVectorSearchEmbeddedFiles((content: any) => {
      resolve(content);
    });
  });
};
