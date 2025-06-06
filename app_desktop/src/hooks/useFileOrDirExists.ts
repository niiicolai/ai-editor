import { useState } from "react";
import { fileOrDirExists } from "../electron/fileOrDirExists";

export const useFileOrDirExists = () => {
  const [isLoading, setIsLoading] = useState(false);

  const exists = async (path:string) => {
    setIsLoading(true);
    try {
      const content = await fileOrDirExists(path);
      return content.data;
    } catch (error) {
      console.error("Error opening file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, exists };
};
