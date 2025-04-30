import { XIcon } from "lucide-react";
import { TabType } from "../../types/directoryInfoType";
import { useTabs } from "../../hooks/useTabs";
import Scrollbar from "react-scrollbars-custom";

function EditorTabsComponent() {
  const { tabs, viewTab, removeTab, isActiveTab } = useTabs();

  return (
    <div className="flex justify-start main-bgg border-b border-color text-sm h-8 overflow-hidden">
      <Scrollbar className="overflow-hidden w-full h-full hide-y-scrollbar">
        <div className="flex justify-start h-full hide-y-scrollbar">
          {tabs &&
            tabs.map((t: TabType) => (
              <div
                key={t.file.id}
                className={`flex tab justify-center border-r ${
                  isActiveTab(t) ? "tab-active" : ""
                }`}
                style={{ height: "2.2em" }}
              >
                <button
                  title={t.file.path}
                  onClick={() => viewTab(t)}
                  className="px-4 py-1 cursor-pointer view-tab-button overflow-hidden truncate"
                >
                  {t.file.name}
                </button>
                <div className="px-3 py-1 flex justify-center">
                  <button
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
