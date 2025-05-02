import Scrollbar from "react-scrollbars-custom";
import HierarchyItemComponent from "./HierarchyItemComponent";
import HierarchyNewComponent from "./HierarchyNewComponent";
import { ChevronRight, ChevronDown, ChevronLeft } from "lucide-react";
import { FileItemType } from "../../types/directoryInfoType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { editorSettingsActions } from "../../features/editorSettings";
import { setInspectorMenu } from "../../features/hierarchy";
import editorNoFiles from "../../assets/editorNoFiles.png";
import HierarchyRightClickMenuComponent from "./HierarchyRightClickMenuComponent";
import HierarchyRenameComponent from "./HierarchyRenameComponent";
import { useEffect } from "react";
import { setIsLoading as setIsLoadingIndex, setItems, setMeta } from "../../features/projectIndex";
import { useReadFile } from "../../hooks/useReadFile";
import { ProjectIndexItemClassType, ProjectIndexItemFunctionType, ProjectIndexItemType, ProjectIndexItemVarType } from "../../types/projectIndexType";
import { useParseFileContent } from "../../hooks/useParseFileContent";
import { useHash } from "../../hooks/useHash";
import { useCreateProjectIndex, useGetProjectIndexExistByName } from "../../hooks/useProjectIndex";
import { useWriteFile } from "../../hooks/useWriteFile";
import { useProjectIndexFile } from "../../hooks/useProjectIndexFile";

function HierarchyComponent() {
  const dispatch = useDispatch();
  const editorSettings = useSelector(
    (state: RootState) => state.editorSettings
  );
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const projectIndex = useSelector((state: RootState) => state.projectIndex);
  const { minimized: isMinimized } = editorSettings.hierarchy;
  const { currentFile, currentPath, directoryState } = hierarchy;
  const currentFolder = currentPath ? currentPath.split("\\").pop() || "" : "";
  const hasFiles = currentPath && directoryState[currentPath]?.files.length > 0;
  const readFile = useReadFile();
  const writeFile = useWriteFile();
  const parseFile = useParseFileContent();
  const hash = useHash();
  const projectIndexFile = useProjectIndexFile();

  const handleContextMenu = (event: any) => {
    event.preventDefault();
    if (event?.target?.classList?.contains("file-item")) return;
    dispatch(
      setInspectorMenu({
        x: event.pageX - 150,
        y: event.pageY,
        file: null,
      })
    );
  };

  const handleIndexing = async () => {
    dispatch(setIsLoadingIndex(true))

    const name = currentPath || '';

    if (!currentPath) {
      dispatch(setIsLoadingIndex(false))
      return;
    }

    let currentProjectIndexFile = await projectIndexFile.read(currentPath);
    if (!currentProjectIndexFile) {
      currentProjectIndexFile = await projectIndexFile.write(currentPath);
    }

    console.log(currentProjectIndexFile)

    if (projectIndex.meta?.name != currentPath) {      
      dispatch(setMeta({ name, _id: currentProjectIndexFile._id }))
    }

    const newItems = {} as ProjectIndexItemType;
    for (const key in hierarchy.directoryState) {
      const files = hierarchy.directoryState[key]
        .files
        .filter((f:FileItemType) => !f.isDirectory);

      for (const f of files) {
        if (projectIndex.items[f.path]) continue;
        const data = await readFile.read(f);
        const parsedData = await parseFile.parse(data?.content || '', data?.language || '')
        const hashCode = hash.hash(data?.content || '', 'sha256')
        newItems[f.path] = {
          _id: "",
          name: f.name,
          lines: parsedData?.lines || 0,
          language: data?.language || "",
          hashCode: hashCode,
          description: parsedData?.description || "",
          functions: parsedData?.functions as ProjectIndexItemFunctionType[] ?? [],
          classes: parsedData?.classes as ProjectIndexItemClassType[] ?? [],
          vars: parsedData?.vars as ProjectIndexItemVarType[] ?? [],
        }
      }
    }
    dispatch(setItems({
      ...projectIndex.items,
      ...newItems
    }))
    dispatch(setIsLoadingIndex(false))
  }

  useEffect(() => {
    if (currentPath && Object.entries(directoryState).length > 0) {
      handleIndexing();
    }
  }, [currentPath, directoryState])

  console.log(projectIndex, hierarchy)

  if (isMinimized) {
    return (
      <div className="h-full flex flex-col justify-center main-bgg text-white p-1">
        <button
          onClick={() =>
            dispatch(editorSettingsActions.setHierarchyMinimized(false))
          }
          className="inline-flex items-center border border-transparent rounded-full shadow-sm text-white button-main disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 hidden lg:block" />
          <ChevronDown className="w-4 h-4 block lg:hidden" />
        </button>
      </div>
    );
  }
  

  return (
    <div className="h-full h-64 lg:w-64 flex flex-col justify-between main-bgg text-white">
      <HierarchyRightClickMenuComponent />

      {currentPath && (
        <Scrollbar className="w-full h-full" onContextMenu={handleContextMenu}>
          <div>
            <div className="px-2 py-1.5 border-b border-color h-8">
              <div className="flex items-center justify-between">
                {currentFolder && (
                  <h2 className="text-sm font-medium highlight-color text-left flex gap-2 items-center">
                    <ChevronRight
                      className={`w-4 h-4 mt-1 transition-transform rotate-90`}
                    />{" "}
                    <span>{currentFolder}</span>
                  </h2>
                )}
              </div>
            </div>
            <div>
              {currentPath && <HierarchyNewComponent path={currentPath} />}
              {currentPath && <HierarchyRenameComponent path={currentPath} />}

              {hasFiles && (
                <div className="px-2 py-1">
                  {hierarchy.directoryState[currentPath].files.map((file) => (
                    <HierarchyItemComponent
                      key={file.path}
                      file={file}
                      level={0}
                      currentFile={currentFile}
                      getChildren={(file: FileItemType) =>
                        file.isDirectory
                          ? hierarchy.directoryState[file.path]?.files || []
                          : []
                      }
                      getIsOpen={(file: FileItemType) =>
                        hierarchy.directoryState[file.path]?.isOpen
                      }
                    />
                  ))}
                </div>
              )}

              {!hasFiles && currentPath && (
                <div className="text-center main-color p-12 flex flex-col items-center justify-center gap-6">
                  <img src={editorNoFiles} className="w-36" />
                  <p>No Files found</p>
                </div>
              )}
            </div>
          </div>
        </Scrollbar>
      )}

      {!currentPath && (
        <div className="text-center main-color p-12 h-full flex flex-col items-center justify-center gap-6">
          <img src={editorNoFiles} className="w-36" />
          <p>No project selected</p>
        </div>
      )}
    </div>
  );
}

export default HierarchyComponent;
