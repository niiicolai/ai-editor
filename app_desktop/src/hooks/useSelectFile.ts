import { setDirectoryState, setCurrentFile } from "../features/hierarchy";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { readDirectory } from "../electron/readDirectory";
import { RootState } from "../store";
import { FileItemType } from "../types/directoryInfoType";
import { readFile } from "../electron/readFile";
import { setFile } from "../features/editor";
import { useGetLanguage } from "./useGetLanguage";
import { setQueue } from "../features/projectIndex";
import { hierarchySettingsActions } from "../features/hierarchySettings";
import { TabType } from "../types/fileTabType";

export const useSelectFile = () => {
  const { queue } = useSelector((state: RootState) => state.projectIndex);
  const { directoryState } = useSelector((state: RootState) => state.hierarchy);
  const { tabs } = useSelector((state: RootState) => state.tabs);
  const { getLanguageFromFile } = useGetLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleToggleIsOpen = async (file: FileItemType) => {
    dispatch(
      setDirectoryState({
        ...directoryState,
        [file.path]: {
          ...directoryState[file.path],
          isOpen: !directoryState[file.path].isOpen,
        },
      })
    );
  };

  const handleLoadDirectory = async (path: string) => {
    setIsLoading(true);
    try {
      const directoryFiles = await readDirectory(path);
      const newQueue = [
        ...queue,
        ...directoryFiles.filter((f) => !f.isDirectory),
      ];
      const newDirectoryState = {
        ...directoryState,
        [path]: {
          isOpen: true,
          files: directoryFiles,
        },
      };

      dispatch(setDirectoryState(newDirectoryState));
      dispatch(setQueue(newQueue));
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
        const directoryExists = directoryState[file.path];
        if (directoryExists) await handleToggleIsOpen(file);
        else await handleLoadDirectory(file.path);
      } else {
        const tab = tabs.find((t:TabType) => t.file.path === file.path);
        const content = tab
        ? tab.file.content
        : (await readFile(file.path)) || "";
        const language = tab 
        ? tab.file.language
        : getLanguageFromFile(file.name);
        const isSaved = tab
        ? tab.file.isSaved
        : true
        
        dispatch(setCurrentFile(file));
        dispatch(
          setFile({
            id: file.path,
            path: file.path,
            name: file.name,
            content,
            language, 
            isSaved
          })
        );
        dispatch(hierarchySettingsActions.setHierarchyResponsiveActive(false));
      }
    } catch (error) {
      console.error("Error selecting file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, select };
};
