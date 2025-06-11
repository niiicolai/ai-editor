import { Circle, XIcon } from "lucide-react";
import { TabType } from "../../types/fileTabType";
import { useFileTabs } from "../../hooks/useFileTabs";
import { setInspectorMenu } from "../../features/tabs";
import { useDispatch } from "react-redux";
import EditorTabsRightClickMenuComponent from "./EditorTabsRightClickMenuComponent";
import Scrollbar from "react-scrollbars-custom";

function EditorTabsComponent() {
  const { tabs, viewTab, removeTab, isActiveTab, useEffectUpdateTabs } = useFileTabs();
  const dispatch = useDispatch();

  const handleContextMenu = (event: any, tab: TabType) => {
    event.preventDefault();
    dispatch(
      setInspectorMenu({
        x: event.pageX,
        y: event.pageY,
        tab,
      })
    );
  };

  useEffectUpdateTabs();

  return (
    <div className="flex justify-start main-bgg border-b border-color text-sm h-8 overflow-hidden">
      <EditorTabsRightClickMenuComponent />
      
      <Scrollbar className="overflow-hidden w-full h-full hide-y-scrollbar">
        <div className="flex justify-start h-full hide-y-scrollbar" data-testid={`editor-file-tabs`}>
          {tabs &&
            tabs.map((t: TabType) => (
              <div
                key={t.file.id}
                className={`flex tab justify-center border-r ${
                  isActiveTab(t) ? "tab-active" : ""
                }`}
                style={{ height: "2.2em" }}
                onContextMenu={(e: any) => handleContextMenu(e, t)}
              >
                <button
                  title={t.file.path}
                  onClick={() => viewTab(t)}
                  data-testid={`editor-file-tab-edit`}
                  className="px-4 py-1 cursor-pointer view-tab-button overflow-hidden truncate flex items-center gap-2"
                >
                  {t.contentIsChanged && (
                    <Circle className="w-2 h-2 highlight-color" />
                  )}
                  <span>{t.file.name}</span>
                </button>
                <div className="px-3 py-1 flex justify-center">
                  <button
                    data-testid={`editor-file-tab-close`}
                    onClick={() => removeTab(t)}
                    className="cursor-pointer rounded-md close-tab-button"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </Scrollbar>
    </div>
  );
}

export default EditorTabsComponent;
