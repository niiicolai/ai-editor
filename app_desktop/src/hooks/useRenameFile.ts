import { setCurrentFile } from "../features/hierarchy";
import { setFile } from "../features/editor";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { renameFile } from "../electron/renameFile";
import { useGetLanguage } from "./useGetLanguage";

export const useRenameFile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { getLanguageFromFile } = useGetLanguage();
  const dispatch = useDispatch();

  const rename = async (filePath: string, newName: string) => {
    setIsLoading(true);
    try {
      const result = await renameFile(filePath, newName);
      if (result.success) {
        const data = result.data;
        console.log('renameFile', data)
      }
    } catch (error) {
      console.error("Error renaming file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, rename };
};
