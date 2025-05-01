import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { FolderIcon } from "lucide-react";
import { useOpenFolder } from "../../hooks/useOpenFolder";

function FolderOptionComponent() {
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const openFolder = useOpenFolder();

  return (
    <>
        {hierarchy.currentPath && (
            <div className="flex justify-start items-center gap-1">
              <FolderIcon className="w-3.5 h-3.5" />
              <button
                className="text-xs button-main"
                onClick={() => openFolder.open()}
              >
                {hierarchy.currentPath}
              </button>
            </div>
          )}
    </>
  );
}

export default FolderOptionComponent;
