export const deleteAllQA = (project_id: string, embeddingModel: string) => {
  return new Promise<any>((resolve) => {
    window.electron.deleteAllQA(project_id, embeddingModel);
    window.electron.onDeleteAllQA((content: any) => {
      resolve(content);
    });
  });
};
