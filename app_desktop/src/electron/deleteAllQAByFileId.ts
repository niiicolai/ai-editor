export const deleteAllQAByFileId = (file_id: string, embeddingModel: string) => {
  return new Promise<any>((resolve) => {
    window.electron.deleteAllQAByFileId(file_id, embeddingModel);
    window.electron.onDeleteAllQAByFileId((content: any) => {
      resolve(content);
    });
  });
};
