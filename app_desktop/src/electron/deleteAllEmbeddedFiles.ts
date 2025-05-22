export const deleteAllEmbeddedFiles = (project_id: string, embeddingModel: string) => {
  return new Promise<any>((resolve) => {
    window.electron.deleteAllEmbeddedFiles(project_id, embeddingModel);
    window.electron.onDeleteAllEmbeddedFiles((content: any) => {
      resolve(content);
    });
  });
};
