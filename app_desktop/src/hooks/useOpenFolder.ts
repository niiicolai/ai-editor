import {
  setDirectoryState,
  setCurrentPath,
} from "../features/hierarchy";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openFolder } from "../electron/openFolder";
import { readDirectory } from "../electron/readDirectory";
import { RootState } from "../store";
import { setQueue } from "../features/projectIndex";

export const useOpenFolder = () => {
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const open = async () => {
    setIsLoading(true);
    try {
      const path = await openFolder();
      if (path) {
        const directoryFiles = await readDirectory(path);
        const newDirectoryState = {
            ...hierarchy.directoryState,
            [path]: {
                isOpen: true,
                files: directoryFiles,
            },
        };

        dispatch(setDirectoryState(newDirectoryState));
        dispatch(setCurrentPath(path));
        dispatch(setQueue(directoryFiles.filter((f) => !f.isDirectory)));
      }
    } catch (error) {
      console.error("Error opening folder:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, open };
};
