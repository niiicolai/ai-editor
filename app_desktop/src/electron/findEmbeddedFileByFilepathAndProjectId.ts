export const findEmbeddedFileByFilepathAndProjectId = (
  filepath: string,
  project_id: string,
  embeddingModel: string
) => {
  return new Promise<any>((resolve) => {
    window.electron.findEmbeddedFileByFilepathAndProjectId(
      filepath,
      project_id,
      embeddingModel
    );
    window.electron.onFindEmbeddedFileByFilepathAndProjectId((content: any) => {
      resolve(content);
    });
  });
};
