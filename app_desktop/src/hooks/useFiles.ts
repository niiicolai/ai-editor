import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { openFolder } from "../electron/openFolder";
import { readDirectory } from "../electron/readDirectory";
import { readFile } from "../electron/readFile";
import { writeFile } from "../electron/writeFile";
import { writeDir } from "../electron/writeDir";

export const useWriteFile = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const mutateAsync = async (path: string, content: string) => {
    setIsPending(true);
    try {
      await writeFile(path, content);
    } catch (error: unknown) {
      if (error instanceof Error) setError(error.message);
      else setError("Something went wrong");
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending, error };
};

const search = (path: string, pattern: string) => {
  return new Promise<string | null>((resolve) => {
    window.electron.search(path, pattern);
    window.electron.onSearchComplete(() => {
      resolve("");
    });
  });
};

export const useFiles = () => {
  const useOpenFolder = () => {
    return useQuery({
      queryKey: ["open-folder"],
      queryFn: openFolder,
      enabled: false, // Only runs when manually triggered
    });
  };

  return {
    useOpenFolder,
    useWriteFile,
    readDirectory,
    readFile,
    writeFile,
    writeDir,
    search,
  };
};
