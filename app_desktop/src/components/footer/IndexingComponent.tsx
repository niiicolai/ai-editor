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
import { useFiles } from "../../hooks/useFiles";
import { useReadFile } from "../../hooks/useReadFile";
import { FileItemType } from "../../types/directoryInfoType";
import { useCreateProjectIndexItem } from "../../hooks/useProjectIndexItem";
import { useNavigate } from "react-router-dom";
import { useIgnoreAi } from "../../hooks/useIgnoreAi"; 

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
  const _files = useFiles();
  const ignoreAi = useIgnoreAi();

  const backendIndexing = async () => {
    dispatch(setIsLoadingIndex(true));
    if (Object.keys(projectIndex.items).length === 0) {
      return dispatch(setIsLoadingIndex(false));
    }

    if (!currentPath) {
      return dispatch(setIsLoadingIndex(false));
    }
    let currentProjectIndexFile = null;
    try {
      currentProjectIndexFile = await projectIndexFile.read(currentPath);
      if (!currentProjectIndexFile?._id) {

        //currentProjectIndexFile = await projectIndexFile.write(currentPath);
      }
    } catch {
      return dispatch(setIsLoadingIndex(false));
    }

    if (!currentProjectIndexFile?._id) {
      return dispatch(setIsLoadingIndex(false));
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
      console.log("Project Index:", projectIndex.items);
      for (const key in projectIndex.items) {
        if (projectIndex.items[key].ignore) {
          console.log("Ignoring file:", projectIndex.items[key].name);
          continue;
        }

        if (projectIndex.items[key]._id) {
          console.log("File already indexed:", projectIndex.items[key].name);
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
        }) as any;
        console.log("Saved item:", savedItem);

        newItems[item.path] = {
          ...item,
          _id: savedItem[0]._id,
        };
      }

      dispatch(
        setItems({
          ...projectIndex.items,
          ...newItems,
        })
      );
    } catch {
      
    } finally {
      dispatch(setIsLoadingIndex(false));
    }
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
    
    const ignoreFiles = await ignoreAi.read(currentPath);
    const newItems = {} as ProjectIndexItemType;
    for (const key in hierarchy.directoryState) {
      const files = hierarchy.directoryState[key].files;
      const allFiles = [] as FileItemType[];
      for (const file of files) {
        if (file.isDirectory) {
          if (ignoreFiles?.includes(file.name)) continue;
          const directoryFiles = await _files.readDirectory(file.path);
          allFiles.push(...directoryFiles);
        } else {
          allFiles.push(file);
        }
      }

      for (const f of allFiles) {
        if (projectIndex.items[f.path]) continue;
        if (f.isDirectory) continue;

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
          ignore: ignoreFiles?.includes(f.name) || false,
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

  useEffect(() => {
    if (currentPath && Object.entries(directoryState).length > 0) {
      clientIndexing();
      backendIndexing();
    }
  }, [currentPath, directoryState]);

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
