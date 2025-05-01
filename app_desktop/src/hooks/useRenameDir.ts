import { setCurrentFile } from "../features/hierarchy";
import { setFile } from "../features/editor";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { renameDir } from "../electron/renameDir";
import { useGetLanguage } from "./useGetLanguage";

export const useRenameDir = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { getLanguageFromFile } = useGetLanguage();
  const dispatch = useDispatch();

  const rename = async (dirPath: string, newName: string) => {
    setIsLoading(true);
    try {
      const result = await renameDir(dirPath, newName);
      if (result.success) {
        const data = result.data;
        console.log('renamedir', data)
      }
    } catch (error) {
      console.error("Error renaming dir:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, rename };
};
