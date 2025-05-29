import { setDirectoryState } from "../features/hierarchy";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { renameDir } from "../electron/renameDir";
import { RootState } from "../store";
import { FileItemType } from "../types/directoryInfoType";

export const useRenameDir = () => {
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const rename = async (dirPath: string, newName: string) => {
    setIsLoading(true);
    try {
      await renameDir(dirPath, newName);
      const parentDirPath = dirPath.split("\\").slice(0, -1).join("\\");
      const parentDirFiles = hierarchy.directoryState[parentDirPath].files.map((file) => {
        if (file.path === dirPath) {
          return {
            ...file,
            name: newName,
            path: `${parentDirPath}\\${newName}`,
          };
        }
        return file;
      }
      ).filter((file): file is FileItemType => file !== undefined);
      const updatedDirectoryState = { ...hierarchy.directoryState };
      if (updatedDirectoryState[dirPath]) {
        const dirFiles = hierarchy.directoryState[dirPath].files;
        const newDirPath = `${parentDirPath}\\${newName}`;
        delete updatedDirectoryState[dirPath];
        updatedDirectoryState[newDirPath] = {
          isOpen: hierarchy.directoryState[dirPath].isOpen,
          files: dirFiles,
        };
      }
      
      const newDirectoryState = {
        ...updatedDirectoryState,
        [parentDirPath]: {
          isOpen: hierarchy.directoryState[parentDirPath].isOpen,
          files: parentDirFiles,
        },
      };
      dispatch(setDirectoryState(newDirectoryState));
    } catch (error) {
      console.error("Error renaming dir:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, rename };
};
