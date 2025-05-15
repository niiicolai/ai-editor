export const insertEmbeddedFile = (body: any) => {
  return new Promise<any>((resolve) => {
    window.electron.insertEmbeddedFile(body);
    window.electron.onInsertEmbeddedFile((content: any) => {
      resolve(content);
    });
  });
};
