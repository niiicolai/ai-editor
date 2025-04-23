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

function HierarchyComponent() {
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
  const currentFolder = currentPath
    ? currentPath.split("\\").pop() || "No Folder"
    : "No Folder";
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

  const getLanguageFromCurrentFile = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "mjs":
        return "javascript";
      case "cjs":
        return "javascript";
      case "js":
        return "javascript";
      case "ts":
        return "typescript";
      case "jsx":
        return "javascript";
      case "tsx":
        return "typescript";
      case "html":
        return "html";
      case "css":
        return "css";
      case "scss":
      case "sass":
        return "scss";
      case "json":
        return "json";
      case "md":
        return "markdown";
      case "py":
        return "python";
      case "java":
        return "java";
      case "c":
        return "c";
      case "cpp":
      case "cc":
      case "cxx":
        return "cpp";
      case "cs":
        return "csharp";
      case "go":
        return "go";
      case "rs":
        return "rust";
      case "rb":
        return "ruby";
      case "php":
        return "php";
      case "sh":
        return "shell";
      case "yaml":
      case "yml":
        return "yaml";
      case "xml":
        return "xml";
      default:
        return "plaintext";
    }
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
            language: getLanguageFromCurrentFile(file.name),
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
      <div className="flex flex-col justify-center main-bgg text-white p-1">
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
    <div className="lg:h-screen h-64 lg:w-64 flex flex-col justify-between main-bgg text-white">
      <div className="flex items-center gap-3 hidden">
        <h2>Options</h2>
        <Plus className="w-4 h-4" />
        <XIcon className="w-4 h-4" />
      </div>

      <Scrollbar className="w-full h-full">
        <div>
          <div className="p-3 border-b border-color h-12">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium highlight-color">
                {currentFolder}
              </h2>
              <div className="flex gap-1">
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
          <div className="p-2">
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}

            {hasFiles &&
              hierarchy.directoryState[currentPath].files.map((file) => (
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
