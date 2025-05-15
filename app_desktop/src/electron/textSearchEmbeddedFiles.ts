export const textSearchEmbeddedFiles = (project_id: string, query: string) => {
  return new Promise<any>((resolve) => {
    window.electron.textSearchEmbeddedFiles(project_id, query);
    window.electron.onTextSearchEmbeddedFiles((content: any) => {
      resolve(content);
    });
  });
};
