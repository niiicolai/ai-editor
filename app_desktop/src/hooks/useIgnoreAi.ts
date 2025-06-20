import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useReadFile } from "./useReadFile";
import { useWriteFile } from "./useWriteFile";

export const useIgnoreAi = () => {
  const ignoreAiFileName = ".palm_ignore_ai";
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const readFile = useReadFile();
  const writeFile = useWriteFile();

  const parse = (content: string) => {
    return content?.split("\n");
  };

  const read = async (path: string) => {
    const directory = hierarchy.directoryState[path];
    const files = directory.files;

    for (const file of files) {
      const isFile = file.name == ignoreAiFileName;

      if (isFile) {
        const result = await readFile.read(file);
        const parsed = parse(result?.content || "");
        if (parsed) return parsed;
        break;
      }
    }

    return null;
  };

  const write = async (path: string) => {
    const filePath = `${path}\\${ignoreAiFileName}`;
    const content = `.palm_project_index\n.palm_ignore_ai\n.env\nnode_modules`;
    await writeFile.write(
      path,
      filePath,
      ignoreAiFileName,
      content
    );
    return { filePath, content };
  };

  return { write, read };
};
