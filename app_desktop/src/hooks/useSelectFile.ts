import { setDirectoryState, setCurrentFile } from "../features/hierarchy";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { readDirectory } from "../electron/readDirectory";
import { RootState } from "../store";
import { FileItemType } from "../types/directoryInfoType";
import { readFile } from "../electron/readFile";
import { setFile } from "../features/editor";
import { useGetLanguage } from "./useGetLanguage";

export const useSelectFile = () => {
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const { getLanguageFromFile } = useGetLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleToggleIsOpen = async (file: FileItemType) => {
    const newDirectoryState = {
      ...hierarchy.directoryState,
      [file.path]: {
        ...hierarchy.directoryState[file.path],
        isOpen: !hierarchy.directoryState[file.path].isOpen,
      },
    };
    dispatch(setDirectoryState(newDirectoryState));
  };

  const handleLoadDirectory = async (path: string) => {
    setIsLoading(true);
    try {
      const directoryFiles = await readDirectory(path);
      const newDirectoryState = {
        ...hierarchy.directoryState,
        [path]: {
          isOpen: true,
          files: directoryFiles,
        },
      };

      dispatch(setDirectoryState(newDirectoryState));
    } catch (error) {
      console.error("Error reading directory:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const select = async (file: FileItemType) => {
    setIsLoading(true);

    try {
        if (file.isDirectory) {
            const directoryExists = hierarchy.directoryState[file.path];
            if (directoryExists) await handleToggleIsOpen(file);
            else await handleLoadDirectory(file.path);
        } else {
            const content = (await readFile(file.path)) || '';
            const language = getLanguageFromFile(file.name);
            dispatch(setCurrentFile(file));
            dispatch(setFile({
                id: file.path,
                path: file.path,
                name: file.name,
                content,
                language,
            }));
        }
    } catch (error) {
      console.error("Error selecting file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, select };
};
