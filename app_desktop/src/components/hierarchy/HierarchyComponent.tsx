import Scrollbar from "react-scrollbars-custom";
import HierarchyItemComponent from "./HierarchyItemComponent";
import HierarchyRightClickMenuComponent from "./HierarchyRightClickMenuComponent";
import HierarchyNewComponent from "./HierarchyNewComponent";
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";
import { FileItemType } from "../../types/directoryInfoType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { editorSettingsActions } from "../../features/editorSettings";
import { setInspectorMenu } from "../../features/hierarchy";

function HierarchyComponent() {
  const dispatch = useDispatch();
  const editorSettings = useSelector((state: RootState) => state.editorSettings);
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const { minimized: isMinimized } = editorSettings.hierarchy;
  const { currentFile, currentPath, directoryState } = hierarchy;
  const currentFolder = currentPath ? currentPath.split("\\").pop() || "" : "";
  const hasFiles = currentPath && directoryState[currentPath]?.files.length > 0;

  const handleContextMenu = (event: any) => {
    event.preventDefault();
    if (!hasFiles) return;
    if (event?.target?.classList?.contains("file-item")) return;
    dispatch(setInspectorMenu({
      x: event.pageX - 150,
      y: event.pageY,
      file: null,
    }));
  };

  if (isMinimized) {
    return (
      <div className="h-full flex flex-col justify-center main-bgg text-white p-1">
        <button
          onClick={() =>
            dispatch(editorSettingsActions.setHierarchyMinimized(false))
          }
          className="inline-flex items-center border border-transparent rounded-full shadow-sm text-white button-main disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 hidden lg:block" />
          <ChevronDown className="w-4 h-4 block lg:hidden" />
        </button>
      </div>
    );
  }

  return (
    <div className="h-full h-64 lg:w-64 flex flex-col justify-between main-bgg text-white">
      <HierarchyRightClickMenuComponent />

      <Scrollbar className="w-full h-full" onContextMenu={handleContextMenu}>
        <div>
          <div className="px-2 py-1.5 border-b border-color h-8">
            <div className="flex items-center justify-between">
              {currentFolder && (
                <h2 className="text-sm font-medium highlight-color text-left flex gap-2 items-center">
                  <ChevronRight
                    className={`w-4 h-4 mt-1 transition-transform rotate-90`}
                  />{" "}
                  <span>{currentFolder}</span>
                </h2>
              )}
            </div>
          </div>
          <div>
            {currentPath && <HierarchyNewComponent path={currentPath} /> }

            {hasFiles && (
              <div className="px-2 py-1">
                {hierarchy.directoryState[currentPath].files.map((file) => (
                  <HierarchyItemComponent
                    key={file.path}
                    file={file}
                    level={0}
                    currentFile={currentFile}
                    getChildren={(file: FileItemType) =>
                      file.isDirectory 
                      ? hierarchy.directoryState[file.path]?.files || []
                      : []
                    }
                    getIsOpen={(file: FileItemType) =>
                      hierarchy.directoryState[file.path]?.isOpen
                    }
                  />
                ))}
              </div>
            )}

            {!hasFiles && (
              <div className="text-center main-color p-4">No files found</div>
            )}
          </div>
        </div>
      </Scrollbar>
    </div>
  );
}

export default HierarchyComponent;
