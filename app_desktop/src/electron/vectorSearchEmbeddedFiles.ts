export const vectorSearchEmbeddedFiles = (project_id: string, queryEmbedding: number[]) => {
  return new Promise<any>((resolve) => {
    window.electron.vectorSearchEmbeddedFiles(project_id, queryEmbedding);
    window.electron.onVectorSearchEmbeddedFiles((content: any) => {
      resolve(content);
    });
  });
};
