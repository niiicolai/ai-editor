import { setDirectoryState, setCurrentPath } from "../features/hierarchy";
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

        // find all nested files for the queue
        const max = 1000;
        let i = 0;
        const findAllFiles = async (
          parentPath: string,
          files: any[],
          fileList: any[]
        ) => {
          i++; if (i >= max) return;

          for (const file of files) {
            if (file.isDirectory) {
              if (file.name === 'node_modules') {
                continue;
              }

              const dirPath = `${parentPath}/${file.name}`;
              const nestedFiles = await readDirectory(dirPath);
              await findAllFiles(dirPath, nestedFiles, fileList);
            } else {
              fileList.push({ ...file, parentPath });
            }
          }
        };

        const allFiles: any[] = [];
        await findAllFiles(path, directoryFiles, allFiles);
        dispatch(setQueue(allFiles));
      }
    } catch (error) {
      console.error("Error opening folder:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, open };
};
