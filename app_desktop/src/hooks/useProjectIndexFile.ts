import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useReadFile } from "./useReadFile";
import { useWriteFile } from "./useWriteFile";
import { useCreateProjectIndex } from "./useProjectIndex";

export const useProjectIndexFile = () => {
  const projectIndexFileName = ".palm_project_index";
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const readFile = useReadFile();
  const writeFile = useWriteFile();
  const createProjectIndex = useCreateProjectIndex();

  const parse = (content: string) => {
    const params = {} as any;
    const _id = content?.split("=")![1];
    if (_id) params._id = _id;
    return params;
  };

  const read = async (path: string) => {
    const directory = hierarchy.directoryState[path];
    const files = directory.files;

    for (const file of files) {
      const isIndexFile = file.name == projectIndexFileName;
      if (isIndexFile) {
        const result = await readFile.read(file);
        const parsed = parse(result?.content || "");
        if (parsed._id) return { _id: parsed._id };
        break;
      }
    }

    return { _id: null };
  };

  const write = async (path: string) => {
    const newProjectIndex = await createProjectIndex.mutateAsync({
      name: path,
    });
    await writeFile.write(
      path,
      `${path}\\${projectIndexFileName}`,
      projectIndexFileName,
      `_id=${newProjectIndex._id}`
    );
    return { _id: newProjectIndex._id };
  };

  return { write, read };
};
