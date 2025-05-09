import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { Clipboard, Loader2Icon } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const backendIndexing = async () => {
    if (!currentPath) {
      return;
    }
    let currentProjectIndexFile = null;
    try {
      currentProjectIndexFile = await projectIndexFile.read(currentPath);
      if (!currentProjectIndexFile?._id) {
        currentProjectIndexFile = await projectIndexFile.write(currentPath);
      }
    } catch {
      return;
    }

    if (!currentProjectIndexFile?._id) {
      return;
    }
    try {
      if (projectIndex.meta?.name != currentPath) {
        dispatch(
          setMeta({
            name: projectIndex.meta?.name ?? "",
            _id: currentProjectIndexFile._id,
          })
        );
      }

      const newItems = {} as ProjectIndexItemType;
      for (const key in projectIndex.items) {
        if (projectIndex.items[key]._id) {
          newItems[key] = projectIndex.items[key];
          continue;
        }

        const item = projectIndex.items[key];
        const data = await readFile.read({
          name: item.name,
          path: item.path,
          isDirectory: false,
        });

        const savedItem = await createProjectIndexItem.mutateAsync({
          name: item.name,
          path: item.path,
          content: data?.content || "",
          lines: item.lines,
          language: item.language,
          hashCode: item.hashCode,
          description: item.description,
          functions: JSON.stringify(
            (item.functions as ProjectIndexItemFunctionType[]) ?? []
          ),
          classes: JSON.stringify(
            (item.classes as ProjectIndexItemClassType[]) ?? []
          ),
          vars: JSON.stringify((item.vars as ProjectIndexItemVarType[]) ?? []),
          projectIndexId: currentProjectIndexFile._id,
        });

        newItems[item.path] = {
          ...item,
          _id: savedItem._id,
        };
      }

      dispatch(
        setItems({
          ...newItems,
        })
      );
    } catch {}
  };

  const clientIndexing = async () => {
    if (!currentPath) {
      return;
    }

    if (projectIndex.meta?.name != currentPath) {
      dispatch(
        setMeta({ name: currentPath, _id: projectIndex.meta?._id ?? null })
      );
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
        newItems[f.path] = {
          _id: "",
          name: f.name,
          path: f.path,
          lines: parsedData?.lines || 0,
          language: data?.language || "",
          hashCode: hashCode,
          description: parsedData?.description || "",
          functions:
            (parsedData?.functions as ProjectIndexItemFunctionType[]) ?? [],
          classes: (parsedData?.classes as ProjectIndexItemClassType[]) ?? [],
          vars: (parsedData?.vars as ProjectIndexItemVarType[]) ?? [],
        };
      }
    }
    dispatch(
      setItems({
        ...projectIndex.items,
        ...newItems,
      })
    );
  };

  const handleIndexing = async () => {
    if (!currentPath) {
      return;
    }
    dispatch(setIsLoadingIndex(true));
    await clientIndexing();
    //await backendIndexing();
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
            onClick={() => navigate("/project-index")}
          >
            <span>Project Index</span>
          </button>
        </div>
      )}
    </>
  );
}
