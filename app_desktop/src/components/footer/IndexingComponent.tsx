import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Clipboard, Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEmbeddingFiles } from "../../hooks/useEmbeddingFiles";

export default function IndexingComponent() {
  const projectIndex = useSelector((state: RootState) => state.projectIndex);
  const embedding = useEmbeddingFiles();
  const navigate = useNavigate();

  useEffect(() => {
    if (projectIndex.queue.length) {
      embedding.synchronize();
    }
  }, [projectIndex.queue]);

  return (
    <>
      {projectIndex.meta && (
        <div className="flex justify-start items-center gap-1">
          {embedding.isLoading ? (
            <Loader2Icon className="w-3 h-3 animate-spin" />
          ) : (
            <Clipboard className="w-3.5 h-3.5" />
          )}
          <button
            className="text-xs button-main flex justify-between gap-1"
            onClick={() => navigate("/project-index")}
          >
            <span>Project Index</span>
          </button>
        </div>
      )}
    </>
  );
}
