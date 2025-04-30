import { useEffect } from "react";
import { useSelectFile } from "../../hooks/useSelectFile";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  setDirectoryState,
  setInspectorMenu,
  setNewFileItem,
} from "../../features/hierarchy";

function HierarchyRightClickMenuComponent() {
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const selectFile = useSelectFile();
  const dispatch = useDispatch();

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
              <p className="main-color p-1 border-b border-color text-sm overflow-hidden truncate">
                {hierarchy.inspectorMenu.file.name}
              </p>
              <div className="flex flex-col justify-start items-start text-sm border-b border-color">
                <button
                  className="flex-1 w-full text-left p-1 button-main cursor-pointer"
                  onClick={onEdit}
                >
                  Edit
                </button>
                <button
                  className="flex-1 w-full text-left p-1 button-main cursor-pointer"
                  onClick={() => console.log('not implemented')}
                >
                  Rename
                </button>
                <button className="flex-1 w-full text-left p-1 button-main cursor-pointer">
                  Delete
                </button>
              </div>
              <div className="flex flex-col justify-start items-start text-sm border-b border-color">
                <button
                  className="flex-1 w-full text-left p-1 button-main cursor-pointer"
                  onClick={() => console.log('not implemented')}
                >
                  Reveal in explorer
                </button>
              </div>
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
          </div>
        </div>
      )}
    </>
  );
}

export default HierarchyRightClickMenuComponent;
