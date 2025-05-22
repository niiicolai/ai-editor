export const textSearchEmbeddedFiles = (project_id: string, query: string, embeddingModel: string) => {
  return new Promise<any>((resolve) => {
    window.electron.textSearchEmbeddedFiles(project_id, query, embeddingModel);
    window.electron.onTextSearchEmbeddedFiles((content: any) => {
      resolve(content);
    });
  });
};
