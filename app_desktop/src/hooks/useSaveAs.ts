import { setCurrentFile, setDirectoryState } from "../features/hierarchy";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFile } from "../features/editor";
import { useGetLanguage } from "./useGetLanguage";
import { saveAs as saveAsElectron } from "../electron/saveAs"; 
import { RootState } from "../store";

export const useSaveAs = () => {
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const [isLoading, setIsLoading] = useState(false);
  const { getLanguageFromFile } = useGetLanguage();
  const dispatch = useDispatch();

  const saveAs = async (defaultPath: string, content: string) => {
    setIsLoading(true);
    try {
      const p = hierarchy.currentPath ? `${hierarchy.currentPath}\\${defaultPath}` : defaultPath;
      const result = await saveAsElectron(p, content);

      if (result.success) {
        const path = result.filePath;
        const splittedPath = path.split(/\/|\\/);
        const name = splittedPath[splittedPath.length - 1];
        const language = getLanguageFromFile(path);

        dispatch(setFile({ id: path, name, path, content, language, isSaved: true }));
        dispatch(setCurrentFile({ name, path, isDirectory: false }));

        const pathWithName = splittedPath.slice(0, splittedPath.length - 1).join('\\')
        for (const key in hierarchy.directoryState) {
            if (key == pathWithName) {
                const files = [
                    ...(hierarchy.directoryState[key]?.files || []),
                    { name, path, isDirectory: false },
                ];
                const newDirectoryState = {
                    ...hierarchy.directoryState,
                    [key]: {
                      isOpen: hierarchy.directoryState[key]?.isOpen || false,
                      files,
                    },
                  };
                dispatch(setDirectoryState(newDirectoryState));
                break;
            }
        }
      }
    } catch (error) {
      console.error("Error opening file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, saveAs };
};
