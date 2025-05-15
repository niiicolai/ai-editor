export const paginateEmbeddedFiles = (page: number, limit: number, project_id: string) => {
  return new Promise<any>((resolve) => {
    window.electron.paginateEmbeddedFiles(page, limit, project_id);
    window.electron.onPaginateEmbeddedFiles((content: any) => {
      resolve(content);
    });
  });
};
