export const findEmbeddedFileByHashAndProjectId = (
  hash: string,
  project_id: string,
  embeddingModel: string
) => {
  return new Promise<any>((resolve) => {
    window.electron.findEmbeddedFileByHashAndProjectId(
      hash,
      project_id,
      embeddingModel
    );
    window.electron.onFindEmbeddedFileByHashAndProjectId((content: any) => {
      resolve(content);
    });
  });
};
