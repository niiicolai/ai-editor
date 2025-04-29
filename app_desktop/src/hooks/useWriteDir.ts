import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { writeDir } from "../electron/writeDir";
import { setDirectoryState } from "../features/hierarchy";
import { RootState } from "../store";

export const useWriteDir = () => {
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const write = async (parentDirPath: string, newDirPath: string, name: string) => {
    setIsLoading(true);
    try {
      writeDir(newDirPath);
      const files = [
        { name, path: newDirPath, isDirectory: true },
        ...hierarchy.directoryState[parentDirPath].files,
      ].sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return 0;
      });
      const newDirectoryState = {
        ...hierarchy.directoryState,
        [parentDirPath]: {
            isOpen: hierarchy.directoryState[parentDirPath].isOpen,
            files,
        },
        [newDirPath]: {
          isOpen: true,
          files: [],
        },
      };
      dispatch(setDirectoryState(newDirectoryState));
    } catch (error) {
      console.error("Error writing directory:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, write };
};
