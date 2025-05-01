import { useEffect } from "react";
import { useSelectFile } from "../../hooks/useSelectFile";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { setInspectorMenu } from "../../features/tabs";
import { useFileTabs } from "../../hooks/useFileTabs";

function EditorTabsRightClickMenuComponent() {
  const { removeTab, isActiveTab } = useFileTabs();
  const { inspectorMenu } = useSelector((state: RootState) => state.tabs);
  const selectFile = useSelectFile();
  const dispatch = useDispatch();

  const handleClickOutside = () => {
    dispatch(setInspectorMenu(null));
  };

  const onEdit = () => {
    if (inspectorMenu?.tab?.file) {
      const { name, path } = inspectorMenu?.tab?.file;
      selectFile.select({ name, path, isDirectory: false });
    }
  };

  useEffect(() => {
    if (inspectorMenu) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [inspectorMenu]);

  return (
    <>
      {inspectorMenu && (
        <div
          className="fixed main-bgg main-color border-color border rounded shadow-lg"
          style={{
            top: inspectorMenu.y,
            left: inspectorMenu.x,
            zIndex: 9999,
            width: "150px",
          }}
        >
          {inspectorMenu?.tab?.file && (
            <>
              <p className="main-color p-1 border-b border-color text-sm overflow-hidden truncate">
                {inspectorMenu.tab.file.name}
              </p>
              <div className="flex flex-col justify-start items-start text-sm border-b border-color">
                {!isActiveTab(inspectorMenu.tab) && (
                  <button
                    className="flex-1 w-full text-left p-1 button-main cursor-pointer"
                    onClick={onEdit}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="flex-1 w-full text-left p-1 button-main cursor-pointer"
                  onClick={() => console.log("not implemented")}
                >
                  Rename
                </button>
                <button className="flex-1 w-full text-left p-1 button-main cursor-pointer">
                  Delete
                </button>
              </div>
            </>
          )}

          {inspectorMenu?.tab && (
            <>
              <div className="flex flex-col justify-start items-start text-sm border-b border-color">
                <button
                  className="flex-1 w-full text-left p-1 button-main cursor-pointer"
                  onClick={() => {
                    if (inspectorMenu?.tab) removeTab(inspectorMenu?.tab);
                  }}
                >
                  Close tab
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default EditorTabsRightClickMenuComponent;
