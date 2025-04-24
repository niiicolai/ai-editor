import Scrollbar from "react-scrollbars-custom";
import HierarchyItemComponent from "./HierarchyItemComponent";

import {
  ChevronRight,
  Folder,
  Loader2,
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  XIcon,
} from "lucide-react";
import { useFiles } from "../../hooks/useFiles";
import { FileItemType } from "../../types/directoryInfoType";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentFile, setDirectoryState } from "../../features/hierarchy";
import { setFile } from "../../features/editor";
import { RootState } from "../../store";
import { editorSettingsActions } from "../../features/editorSettings";
import { useGetLanguage } from "../../hooks/useGetLanguage";

function HierarchyComponent() {
  const { getLanguageFromFile } = useGetLanguage();
  const { useOpenFolder, readDirectory, readFile } = useFiles();
  const { refetch: openFolder, isFetching: isOpeningFolder } = useOpenFolder();

  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const isMinimized = useSelector(
    (state: RootState) => state.editorSettings.hierarchy.minimized
  );
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const { currentFile, directoryState } = hierarchy;
  const currentFolder = currentPath ? currentPath.split("\\").pop() || "" : "";
  const hasFiles = currentPath && directoryState[currentPath]?.files.length > 0;

  const handleOpenFolder = async () => {
    const result = await openFolder();
    const path = result?.data;
    if (path) {
      handleLoadDirectory(path);
      dispatch(setDirectoryState({}));
      setCurrentPath(path);
    }
  };

  const handleToggleIsOpen = async (file: FileItemType) => {
    const newDirectoryState = {
      ...directoryState,
      [file.path]: {
        ...directoryState[file.path],
        isOpen: !directoryState[file.path].isOpen,
      },
    };
    dispatch(setDirectoryState(newDirectoryState));
  };

  const handleFileSelect = async (file: FileItemType) => {
    if (file.isDirectory) {
      const directoryExists = directoryState[file.path];
      if (directoryExists) handleToggleIsOpen(file);
      else handleLoadDirectory(file.path);
    } else {
      setIsLoading(true);
      try {
        const content = await readFile(file.path);
        dispatch(setCurrentFile(file));
        dispatch(
          setFile({
            id: file.path,
            path: file.path,
            name: file.name,
            content: content || "",
            language: getLanguageFromFile(file.name),
          })
        );
      } catch (error) {
        console.error("Error reading file:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLoadDirectory = async (path: string) => {
    setIsLoading(true);
    try {
      const directoryFiles = await readDirectory(path);
      const sortedDirectoryFiles = directoryFiles.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return 0;
      });
      const newDirectoryState = {
        ...hierarchy.directoryState,
        [path]: {
          isOpen: true,
          files: sortedDirectoryFiles,
        },
      };

      dispatch(setDirectoryState(newDirectoryState));
    } catch (error) {
      console.error("Error reading directory:", error);
    } finally {
      setIsLoading(false);
    }
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
      <div className="flex items-center gap-3 hidden">
        <h2>Options</h2>
        <Plus className="w-4 h-4" />
        <XIcon className="w-4 h-4" />
      </div>

      <Scrollbar className="w-full h-full">
        <div>
          <div className="p-1 border-b border-color h-8">
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-1">
                <button
                  onClick={handleOpenFolder}
                  disabled={isOpeningFolder}
                  className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white button-main disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOpeningFolder ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Folder className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() =>
                    dispatch(editorSettingsActions.setHierarchyMinimized(true))
                  }
                  className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white button-main disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 hidden lg:block" />
                  <ChevronUp className="w-4 h-4 block lg:hidden" />
                </button>
              </div>
            </div>
          </div>
          <div>
            {currentFolder && (
              <div className="border-color border-b p-1">
                <h2 className="text-sm font-medium highlight-color text-left flex gap-2 items-center">
                <ChevronRight className={`w-4 h-4 mt-1 transition-transform rotate-90`} /> <span>{currentFolder}</span>
                </h2>
              </div>
            )}
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}

            {hasFiles && (
              <div className="px-2 py-1">
                {hierarchy.directoryState[currentPath].files.map((file) => (
                  <HierarchyItemComponent
                    key={file.path}
                    file={file}
                    level={0}
                    currentFile={currentFile}
                    getChildren={(file: FileItemType) =>
                      hierarchy.directoryState[file.path]?.files || []
                    }
                    getIsOpen={(file: FileItemType) =>
                      hierarchy.directoryState[file.path]?.isOpen
                    }
                    handleFileSelect={handleFileSelect}
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
