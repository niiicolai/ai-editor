import { Link } from "react-router-dom";
import { Loader, XIcon } from "lucide-react";
import Scrollbar from "react-scrollbars-custom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { usePagination } from "../../hooks/usePagination";
import {
  useDestroyEmbeddedFile,
  useDestroyEmbeddedFiles,
} from "../../hooks/useEmbeddedFile";
import {
  useDestroyAllQA,
} from "../../hooks/useQAFile";
import { QAType } from "../../types/qaType";
import { useGetQAs } from "../../hooks/useQAFile";

function ProjectIndexIndexView() {
  const projectIndex = useSelector((state: RootState) => state.projectIndex);
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const projectId = projectIndex.meta?._id as string;
  const { page, limit, prevPage, nextPage } = usePagination(10);
  const { data, isLoading, error } = useGetQAs(
    page,
    limit,
    projectId
  );
  const destroyFile = useDestroyEmbeddedFile();
  const destroyFiles = useDestroyEmbeddedFiles();
  const destroyAllQa = useDestroyAllQA();

  const handleDestroyFiles = async () => {
    try {
      await destroyFiles.mutateAsync(projectId);
      await destroyAllQa.mutateAsync(projectId);
    } catch {}
  };

  return (
    <Scrollbar className="flex min-h-screen main-bgg main-color">
      <div className="w-full p-6">
        <div className="secondary-bgg border border-color shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-color">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium main-color" data-testid="project-index-title">
                Project Index:{" "}
                {!projectIndex?.meta?._id
                  ? "No active index"
                  : hierarchy.currentPath}
              </h3>
              <div className="flex justify-start items-center gap-3">
                {data?.success && data?.result.data.length > 0 && (
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
                  data-testid="project-index-back-link"
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
                {data?.success && data?.result.data.length === 0 && (
                  <div className="p-3">
                    <p>No files found</p>
                  </div>
                )}
                {data?.success &&
                  data?.result.data.map((qa: QAType) => (
                    <div
                      key={qa.rowid}
                      className="px-4 py-2 border-b border-color"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-sm font-medium main-color">
                          {qa.rowid}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {qa.qa}
                        </p>
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
