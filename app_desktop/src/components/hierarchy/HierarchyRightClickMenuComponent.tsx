import { useEffect } from "react";
import { useSelectFile } from "../../hooks/useSelectFile";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  setDirectoryState,
  setInspectorMenu,
  setNewFileItem,
  setRenameFileItem,
} from "../../features/hierarchy";
import { File, Folder } from "lucide-react";
import { FileItemType } from "../../types/directoryInfoType";
import { useFocusFiles } from "../../hooks/useFocusFiles";
import { useIgnoreAi } from "../../hooks/useIgnoreAi";

function HierarchyRightClickMenuComponent() {
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const { sessionId } = useSelector(
    (state: RootState) => state.userAgentSession
  );
  const selectFile = useSelectFile();
  const dispatch = useDispatch();
  const focusFiles = useFocusFiles();
  const ignoreAi = useIgnoreAi();

  const handleClickOutside = () => {
    dispatch(setInspectorMenu(null));
  };

  const onEdit = () => {
    if (hierarchy.inspectorMenu?.file) {
      selectFile.select(hierarchy.inspectorMenu.file);
    }
  };

  const onNewHierarchyItem = (isDirectory: boolean) => {
    if (hierarchy.inspectorMenu?.file) {
      const file = hierarchy.inspectorMenu?.file;
      const path = file.isDirectory
        ? file.path
        : file.path.replace(`\\${file.name}`, "");
      const newDirectoryState = {
        ...hierarchy.directoryState,
        [file.path]: {
          ...hierarchy.directoryState[file.path],
          isOpen: true,
        },
      };
      dispatch(setDirectoryState(newDirectoryState));
      dispatch(
        setNewFileItem({
          path,
          isDirectory,
          name: "",
        })
      );
    } else if (hierarchy.currentPath) {
      dispatch(
        setNewFileItem({
          path: hierarchy.currentPath,
          isDirectory,
          name: "",
        })
      );
    }
  };

  const onSetRenameFileItem = (file: FileItemType | null) => {
    dispatch(setRenameFileItem(file));
  };

  const onAddIgnoreAi = async () => {
    const path = hierarchy.currentPath;
    if (!path) return;

    let file = null;
    try {
      file = await ignoreAi.read(path);
    } catch {
    }

    if (!file) {
      file = await ignoreAi.write(path)
    }
  }

  useEffect(() => {
    if (hierarchy.inspectorMenu) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [hierarchy.inspectorMenu]);

  return (
    <>
      {hierarchy.inspectorMenu && (
        <div
          className="fixed main-bgg main-color border-color border rounded shadow-lg"
          style={{
            top: hierarchy.inspectorMenu.y,
            left: hierarchy.inspectorMenu.x,
            zIndex: 9999,
            width: "150px",
          }}
        >
          {hierarchy.inspectorMenu?.file && (
            <>
              <p className="flex gap-1 items-center main-color p-1 border-b border-color text-sm overflow-hidden truncate">
                {hierarchy.inspectorMenu.file.isDirectory ? (
                  <Folder className="w-4 h-4" />
                ) : (
                  <File className="w-4 h-4" />
                )}
                <span>{hierarchy.inspectorMenu.file.name}</span>
              </p>
              <div className="flex flex-col justify-start items-start text-sm border-b border-color">
                {!hierarchy.inspectorMenu?.file?.isDirectory && (
                  <button
                    className="flex-1 w-full text-left p-1 button-main cursor-pointer"
                    onClick={onEdit}
                  >
                    Edit
                  </button>
                )}
                {hierarchy.inspectorMenu?.file && (
                  <button
                    className="flex-1 w-full text-left p-1 button-main cursor-pointer"
                    onClick={() =>
                      onSetRenameFileItem(hierarchy.inspectorMenu?.file ?? null)
                    }
                  >
                    Rename
                  </button>
                )}
                <button className="flex-1 w-full text-left p-1 button-main cursor-pointer">
                  Delete
                </button>
              </div>
              <div className="flex flex-col justify-start items-start text-sm border-b border-color">
                <button
                  className="flex-1 w-full text-left p-1 button-main cursor-pointer"
                  onClick={() => console.log("not implemented")}
                >
                  Reveal in explorer
                </button>
              </div>
              {sessionId && (
                <div className="flex flex-col justify-start items-start text-sm border-b border-color">
                  <button
                    className="flex-1 w-full text-left p-1 button-main cursor-pointer"
                    onClick={() =>
                      focusFiles.addFile(
                        hierarchy?.inspectorMenu?.file ?? null,
                        null
                      )
                    }
                  >
                    Add to chat
                  </button>
                </div>
              )}
            </>
          )}

          <div className="flex flex-col justify-start items-start text-sm  border-color">
            <button
              className="flex-1 w-full text-left p-1 button-main cursor-pointer"
              onClick={() => onNewHierarchyItem(false)}
            >
              Add file
            </button>
            <button
              className="flex-1 w-full text-left p-1 button-main cursor-pointer"
              onClick={() => onNewHierarchyItem(true)}
            >
              Add directory
            </button>
            <button
              className="flex-1 w-full text-left p-1 button-main cursor-pointer"
              onClick={() => onAddIgnoreAi()}
            >
              Add AI Ignore File
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default HierarchyRightClickMenuComponent;
