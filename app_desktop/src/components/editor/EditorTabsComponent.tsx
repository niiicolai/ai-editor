import { XIcon } from "lucide-react";
import { FileType, TabType } from "../../types/directoryInfoType";
import Scrollbar from "react-scrollbars-custom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setFile } from "../../features/editor";

function EditorTabsComponent() {
  const editor = useSelector((state: RootState) => state.editor);
  const [tabs, setTabs] = useState<TabType[]>([{ file: editor.file }]);
  const dispatch = useDispatch();

  const viewTab = (t: TabType) => {
    dispatch(setFile(t.file));
  };

  const removeTab = (t: TabType) => {
    let i = 0;
    for (const tab of tabs) {
      if (tab.file.name === t.file.name) {
        tabs.splice(i, 1); // Remove the tab at index i
        break;
      }
      i++;
    }
    if (tabs.length === 0) {
      const dummyFile = {
        id: "",
        name: "new_file",
        content: "",
        language: "javascript",
        path: "",
      };
      dispatch(setFile(dummyFile));
      setTabs([{ file: dummyFile }]);
    } else {
      if (editor.file.name === t.file.name) dispatch(setFile(tabs[0].file));
      setTabs([...tabs]);
    }
  };

  const updateTabsOnFileOpen = (file: FileType) => {
    if (
      tabs.length === 1 &&
      tabs[0].file.name === "new_file" &&
      tabs[0].file.content === ""
    ) {
      setTabs([{ file }]);
      return;
    }
    for (const tab of tabs) {
      if (tab.file.name === file.name) {
        viewTab({ file });
        return;
      }
    }
    setTabs([{ file }, ...tabs]);
  };

  useEffect(() => {
    if (editor.file) {
      updateTabsOnFileOpen(editor.file);
    }
  }, [editor.file]);

  return (
    <div className="flex justify-start main-bgg border-b border-color text-sm h-12 overflow-hidden">
      <Scrollbar className="overflow-hidden w-full h-full hide-y-scrollbar">
        <div className="flex justify-start">
          {tabs &&
            tabs.map((t: TabType) => (
              <div
                key={t.file.path}
                className={`flex tab justify-center border-r ${
                    editor.file.name === t.file.name ? "tab-active" : ""
                }`}
              >
                <button
                  onClick={() => viewTab(t)}
                  className="px-3 py-2 cursor-pointer view-tab-button overflow-hidden truncate"
                >
                  {t.file.name}
                </button>
                <div className="px-3 py-4 flex justify-center">
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
