
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDirectoryState } from "../features/hierarchy";
import { writeFile } from "../electron/writeFile";
import { RootState } from "../store";

export const useWriteFile = () => {
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const write = async (
    parentDirPath: string,
    filePath: string,
    name: string,
    content: string
  ) => {
    setIsLoading(true);
    try {
      writeFile(filePath, content);
      const files = [
        { name, path: filePath, isDirectory: false },
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
      };
      dispatch(setDirectoryState(newDirectoryState));
    } catch (error) {
      console.error("Error writing file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, write };
};
