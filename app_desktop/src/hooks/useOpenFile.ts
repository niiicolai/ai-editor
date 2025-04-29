import { setCurrentFile } from "../features/hierarchy";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { openFile } from "../electron/openFile";
import { readFile } from "../electron/readFile";
import { setFile } from "../features/editor";
import { useGetLanguage } from "./useGetLanguage";

export const useOpenFile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { getLanguageFromFile } = useGetLanguage();
  const dispatch = useDispatch();

  const open = async () => {
    setIsLoading(true);
    try {
      const path = await openFile();
      if (path) {
        const content = (await readFile(path)) || '';
        const splittedPath = path.split(/\/|\\/);
        const name = splittedPath[splittedPath.length - 1];
        const language = getLanguageFromFile(path);

        dispatch(setFile({ id: path, name, path, content, language }));
        dispatch(setCurrentFile({ name, path, isDirectory: false }));
      }
    } catch (error) {
      console.error("Error opening file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, open };
};
