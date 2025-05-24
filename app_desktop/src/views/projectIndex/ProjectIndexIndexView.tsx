import { Link } from "react-router-dom";
import { Loader, XIcon } from "lucide-react";
import Scrollbar from "react-scrollbars-custom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { usePagination } from "../../hooks/usePagination";
import {
  useGetEmbeddedFiles,
  useDestroyEmbeddedFile,
  useDestroyEmbeddedFiles,
} from "../../hooks/useEmbeddedFile";
import { EmbeddedFileType } from "../../types/embeddedFileType";
import { QAType } from "../../types/qaType";

function ProjectIndexIndexView() {
  const projectIndex = useSelector((state: RootState) => state.projectIndex);
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const projectId = projectIndex.meta?._id as string;
  const { page, limit, prevPage, nextPage } = usePagination(10);
  const { data, isLoading, error } = useGetEmbeddedFiles(
    page,
    limit,
    projectId
  );
  const destroyFile = useDestroyEmbeddedFile();
  const destroyFiles = useDestroyEmbeddedFiles();
  console.log(data)
  const handleDestroyFile = async (id: number) => {
    try {
      await destroyFile.mutateAsync(id);
    } catch {}
  };

  const handleDestroyFiles = async () => {
    try {
      await destroyFiles.mutateAsync(projectId);
    } catch {}
  };

  return (
    <Scrollbar className="flex min-h-screen main-bgg main-color">
      <div className="w-full p-6">
        <div className="secondary-bgg border border-color shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-color">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium main-color">
                Project Index:{" "}
                {!projectIndex?.meta?._id
                  ? "No active index"
                  : hierarchy.currentPath}
              </h3>
              <div className="flex justify-start items-center gap-3">
                {data?.success && data?.result.files.length > 0 && (
                  <button
                    onClick={handleDestroyFiles}
                    className="px-4 py-2 rounded-md button-main"
                  >
                    {destroyFiles.isPending ? (
                      <Loader className="w-4 h-4" />
                    ) : (
                      "Delete All Files"
                    )}
                  </button>
                )}
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md button-main"
                >
                  <XIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {(destroyFile?.error || destroyFiles?.error) && (
            <div className="p-3 text-red-500">
              <p>
                {destroyFile?.error
                  ? (destroyFile.error as Error).message
                  : destroyFiles?.error
                  ? (destroyFiles.error as Error).message
                  : null}
              </p>
            </div>
          )}

          {projectIndex?.meta?._id && (
            <>
              <div className="flex flex-col justify-start gap-3">
                {isLoading && (
                  <div>
                    <Loader className="w-4 h-4" />
                    <p>Loading...</p>
                  </div>
                )}
                {error && (
                  <div>
                    <h4>Error</h4>
                    <p>{error.message}</p>
                  </div>
                )}
                {data?.success && data?.result.files.length === 0 && (
                  <div className="p-3">
                    <p>No files found</p>
                  </div>
                )}
                {data?.success &&
                  data?.result.files.map((embeddedFile: EmbeddedFileType) => (
                    <div
                      key={embeddedFile.rowid}
                      className="px-4 py-2 border-b border-color"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium main-color">
                          {embeddedFile.filename}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {embeddedFile.filepath}
                        </p>
                      </div>
                      <div className="flex flex-col gap-3 mb-3">
                        <div className="text-xs text-gray-400 flex flex-col gap-1">
                          {embeddedFile?.question_answers?.map((qa:QAType) => (
                            <div key={qa.rowid} className="border border-color p-3">
                              {qa.qa}
                            </div>
                          ))}
                          {!embeddedFile?.question_answers?.length && (
                            <div className="border border-color p-3">
                              No question and answers found
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">
                          Hash: {embeddedFile.hash}
                        </p>
                        <div>
                          <button
                            onClick={() =>
                              handleDestroyFile(embeddedFile.rowid)
                            }
                            className="px-4 py-2 rounded-md button-main"
                          >
                            {destroyFile.isPending ? (
                              <Loader className="w-4 h-4" />
                            ) : (
                              "Delete"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="flex justify-between p-4">
                <button
                  onClick={prevPage}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-md button-main"
                >
                  Previous
                </button>
                <div className="text-center">
                  Page {page} of {data?.result?.pages ?? 0}
                </div>
                <button
                  onClick={() => nextPage(data?.result?.pages ?? 0)}
                  disabled={page >= (data?.result?.pages ?? 0)}
                  className="px-4 py-2 rounded-md button-main"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Scrollbar>
  );
}

export default ProjectIndexIndexView;
