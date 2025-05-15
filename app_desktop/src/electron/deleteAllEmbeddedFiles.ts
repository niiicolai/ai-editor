export const deleteAllEmbeddedFiles = (project_id: string) => {
  return new Promise<any>((resolve) => {
    window.electron.deleteAllEmbeddedFiles(project_id);
    window.electron.onDeleteAllEmbeddedFiles((content: any) => {
      resolve(content);
    });
  });
};
