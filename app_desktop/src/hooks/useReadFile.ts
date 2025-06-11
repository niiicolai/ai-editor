import { useState } from "react";
import { FileItemType } from "../types/directoryInfoType";
import { readFile } from "../electron/readFile";
import { useGetLanguage } from "./useGetLanguage";

export const useReadFile = () => {
  const { getLanguageFromFile } = useGetLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const read = async (file: FileItemType) => {
    setIsLoading(true);

    try {
        if (file.isDirectory) {
            throw new Error("file is directory")
        } else {
            const content = (await readFile(file.path)) || '';
            const language = getLanguageFromFile(file.name);

            return {
                path: file.path,
                name: file.name,
                isDirectory: file.isDirectory,
                content,
                language, 
                isSaved: true
            }
        }
    } catch (error) {
      console.error("Error reading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, read };
};
