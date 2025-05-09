import { setCurrentFile, setDirectoryState } from "../features/hierarchy";
import { setFile } from "../features/editor";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { renameFile } from "../electron/renameFile";
import { useGetLanguage } from "./useGetLanguage";
import { RootState } from "../store";
import { FileItemType } from "../types/directoryInfoType";
import { setTabs } from "../features/tabs";

export const useRenameFile = () => {
  const editor = useSelector((state: RootState) => state.editor);
  const fileTabs = useSelector((state: RootState) => state.tabs);
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const [isLoading, setIsLoading] = useState(false);
  const { getLanguageFromFile } = useGetLanguage();
  const dispatch = useDispatch();

  const rename = async (filePath: string, newName: string) => {
    setIsLoading(true);

    try {
      await renameFile(filePath, newName);

      // Update the file in the hierarchy state
      const parentDirPath = filePath.split("\\").slice(0, -1).join("\\");
      const files = hierarchy.directoryState[parentDirPath].files
        .map((file) => {
          if (file.path === filePath) {
            return {
              ...file,
              name: newName,
              path: `${parentDirPath}\\${newName}`,
            };
          }
          return file;
        })
        .filter((file): file is FileItemType => file !== undefined);
      const newDirectoryState = {
        ...hierarchy.directoryState,
        [parentDirPath]: {
          isOpen: hierarchy.directoryState[parentDirPath].isOpen,
          files,
        },
      };
      dispatch(setDirectoryState(newDirectoryState));

      // Update the file in the tabs state
      const updatedTabs = fileTabs.tabs.map((tab) => {
        if (tab.file.path === filePath) {
          return {
            ...tab,
            file: {
              ...tab.file,
              name: newName,
              path: `${parentDirPath}\\${newName}`,
            },
          };
        }
        return tab;
      });
      dispatch(setTabs(updatedTabs));

      // Update the current file in the editor state
      if (hierarchy.currentFile?.path === filePath) {
        const path = `${parentDirPath}\\${newName}`;
        const language = getLanguageFromFile(path);
        dispatch(
          setFile({
            ...editor.file,
            id: path,
            path,
            name: newName,
            language,
          })
        );
        dispatch(
          setCurrentFile({
            name: newName,
            path,
            isDirectory: false,
          })
        );
      }
    } catch (error) {
      console.error("Error renaming file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, rename };
};
