import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useReadFile } from "./useReadFile";
import { useWriteFile } from "./useWriteFile";
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";

export const useProjectIndexFile = () => {
  const projectIndexFileName = ".palm_project_index";
  const [projectId, setProjectId] = useState("");
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const readFile = useReadFile();
  const writeFile = useWriteFile();

  const parse = (content: string) => {
    const params = {} as any;
    const _id = content?.split("=")![1];
    if (_id) params._id = _id;
    return params;
  };

  const read = async (path: string) => {
    if (projectId) return { _id: projectId };
    const directory = hierarchy.directoryState[path];
    const files = directory.files;

    for (const file of files) {
      const isIndexFile = file.name == projectIndexFileName;
      if (isIndexFile) {
        const result = await readFile.read(file);
        const parsed = parse(result?.content || "");
        const _id = parsed?._id;
        if (_id) {
          setProjectId(_id);
          return { _id };
        }
        break;
      }
    }

    return { _id: null };
  };

  const write = async (path: string) => {
    if (projectId) return { _id: projectId };

    const _id = uuidv4();
    await writeFile.write(
      path,
      `${path}\\${projectIndexFileName}`,
      projectIndexFileName,
      `_id=${_id}`
    );
    setProjectId(_id);
    return { _id };
  };

  const writeOrRead = async (path: string) => {
    const data = await read(path);
    if (data && data._id) {
      return data;
    }

    return await write(path);
  }

  return { write, read, writeOrRead };
};
