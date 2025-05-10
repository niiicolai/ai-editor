import Scrollbar from "react-scrollbars-custom";
import HierarchyItemComponent from "./HierarchyItemComponent";
import HierarchyNewComponent from "./HierarchyNewComponent";
import HierarchyDeleteComponent from "./HierarchyDeleteComponent";
import editorNoFiles from "../../assets/editorNoFiles.png";
import HierarchyRightClickMenuComponent from "./HierarchyRightClickMenuComponent";
import { ChevronRight, ChevronDown, ChevronLeft } from "lucide-react";
import { FileItemType } from "../../types/directoryInfoType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { hierarchySettingsActions } from "../../features/hierarchySettings";
import { setInspectorMenu } from "../../features/hierarchy";


function HierarchyComponent() {
  const dispatch = useDispatch();
  const { minimized: isMinimized } = useSelector((state: RootState) => state.hierarchySettings);
  const { currentFile, currentPath, directoryState, renameFileItem }  = useSelector((state: RootState) => state.hierarchy);
  const currentFolder = currentPath ? currentPath.split("\\").pop() || "" : "";
  const hasFiles = currentPath && directoryState[currentPath]?.files.length > 0;

  const handleContextMenu = (event: any) => {
    event.preventDefault();
    if (event?.target?.classList?.contains("file-item")) return;
    dispatch(
      setInspectorMenu({
        x: event.pageX - 150,
        y: event.pageY,
        file: null,
      })
    );
  };

  if (isMinimized) {
    return (
      <div className="h-full flex flex-col justify-center main-bgg text-white p-1">
        <button
          onClick={() =>
            dispatch(hierarchySettingsActions.setHierarchyMinimized(false))
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
      <HierarchyDeleteComponent />

      {currentPath && (
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
              {currentPath && <HierarchyNewComponent path={currentPath} />}

              {hasFiles && (
                <div className="px-2 py-1">
                  {directoryState[currentPath].files.map((file) => (
                    <HierarchyItemComponent
                      key={file.path}
                      file={file}
                      level={0}
                      renameFileItem={renameFileItem}
                      currentFile={currentFile}
                      getChildren={(file: FileItemType) =>
                        file.isDirectory
                          ? directoryState[file.path]?.files || []
                          : []
                      }
                      getIsOpen={(file: FileItemType) =>
                        directoryState[file.path]?.isOpen
                      }
                    />
                  ))}
                </div>
              )}

              {!hasFiles && currentPath && (
                <div className="text-center main-color p-12 flex flex-col items-center justify-center gap-6">
                  <img src={editorNoFiles} className="w-36" />
                  <p>No Files found</p>
                </div>
              )}
            </div>
          </div>
        </Scrollbar>
      )}

      {!currentPath && (
        <div className="text-center main-color p-12 h-full flex flex-col items-center justify-center gap-6">
          <img src={editorNoFiles} className="w-36" />
          <p>No project selected</p>
        </div>
      )}
    </div>
  );
}

export default HierarchyComponent;
