import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { Clipboard, Loader2Icon } from "lucide-react";
import { useWriteFile } from "../../hooks/useWriteFile";
import { useParseFileContent } from "../../hooks/useParseFileContent";
import { useHash } from "../../hooks/useHash";
import { useProjectIndexFile } from "../../hooks/useProjectIndexFile";
import { useEffect } from "react";
import {
  setIsLoading as setIsLoadingIndex,
  setItems,
  setMeta,
} from "../../features/projectIndex";
import {
  ProjectIndexItemClassType,
  ProjectIndexItemFunctionType,
  ProjectIndexItemType,
  ProjectIndexItemVarType,
} from "../../types/projectIndexType";
import { useReadFile } from "../../hooks/useReadFile";
import { FileItemType } from "../../types/directoryInfoType";
import { useCreateProjectIndexItem } from "../../hooks/useProjectIndexItem";

export default function IndexingComponent() {
  const projectIndex = useSelector((state: RootState) => state.projectIndex);
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const { currentPath, directoryState } = hierarchy;

  const readFile = useReadFile();
  const parseFile = useParseFileContent();
  const hash = useHash();
  const projectIndexFile = useProjectIndexFile();
  const createProjectIndexItem = useCreateProjectIndexItem();
  const dispatch = useDispatch();

  const handleIndexing = async () => {
    dispatch(setIsLoadingIndex(true));

    const name = currentPath || "";

    if (!currentPath) {
      dispatch(setIsLoadingIndex(false));
      return;
    }

    let currentProjectIndexFile = await projectIndexFile.read(currentPath);
    if (!currentProjectIndexFile?._id) {
      currentProjectIndexFile = await projectIndexFile.write(currentPath);
    }

    console.log(currentProjectIndexFile);

    if (projectIndex.meta?.name != currentPath) {
      dispatch(setMeta({ name, _id: currentProjectIndexFile._id }));
    }

    const newItems = {} as ProjectIndexItemType;
    for (const key in hierarchy.directoryState) {
      const files = hierarchy.directoryState[key].files.filter(
        (f: FileItemType) => !f.isDirectory
      );

      for (const f of files) {
        if (projectIndex.items[f.path]) continue;
        const data = await readFile.read(f);
        const parsedData = await parseFile.parse(
          data?.content || "",
          data?.language || ""
        );
        const hashCode = hash.hash(data?.content || "", "sha256");
        const newItem = {
          _id: "",
          name: f.name,
          lines: parsedData?.lines || 0,
          language: data?.language || "",
          hashCode: hashCode,
          description: parsedData?.description || "",
          functions: JSON.stringify((parsedData?.functions as ProjectIndexItemFunctionType[]) ?? []),
          classes: JSON.stringify((parsedData?.classes as ProjectIndexItemClassType[]) ?? []),
          vars: JSON.stringify((parsedData?.vars as ProjectIndexItemVarType[]) ?? []),
        };
        const savedItem = await createProjectIndexItem.mutateAsync({
          name: newItem.name,
          path: f.path,
          content: data?.content || "",
          lines: newItem.lines,
          language: newItem.language,
          hashCode: newItem.hashCode,
          description: newItem.description,
          functions: newItem.functions,
          classes: newItem.classes,
          vars: newItem.vars,
          projectIndexId: currentProjectIndexFile._id
        });
        newItems[f.path] = {
          ...newItem,
          _id: savedItem._id,
          functions: (parsedData?.functions as ProjectIndexItemFunctionType[]) ?? [],
          classes: (parsedData?.classes as ProjectIndexItemClassType[]) ?? [],
          vars: (parsedData?.vars as ProjectIndexItemVarType[]) ?? [],
        }
      }
    }
    dispatch(
      setItems({
        ...projectIndex.items,
        ...newItems,
      })
    );
    dispatch(setIsLoadingIndex(false));
  };

  useEffect(() => {
    if (currentPath && Object.entries(directoryState).length > 0) {
      handleIndexing();
    }
  }, [currentPath, directoryState]);

  console.log(projectIndex);

  return (
    <>
      {projectIndex.meta && (
        <div className="flex justify-start items-center gap-1">
          {projectIndex.isLoading ? (
            <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Clipboard className="w-3.5 h-3.5" />
          )}
          <button
            className="text-xs button-main flex justify-between gap-1"
            onClick={() => console.log("not implemented")}
          >
            <span>Project Index</span>
          </button>
        </div>
      )}
    </>
  );
}
