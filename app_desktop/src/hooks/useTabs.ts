import { useEffect, useState } from "react";
import { setFile } from "../features/editor";
import { setCurrentFile } from "../features/hierarchy";
import { useDispatch, useSelector } from "react-redux";
import { FileType, TabType } from "../types/directoryInfoType";
import { RootState } from "../store";

export const useTabs = () => {
  const editor = useSelector((state: RootState) => state.editor);
  const [tabs, setTabs] = useState<TabType[]>([{ file: editor.file }]);
  const dispatch = useDispatch();

  const isActiveTab = (t: TabType) => {
    return editor.file.name === t.file.name;
  }

  const viewTab = (t: TabType) => {
    dispatch(setFile(t.file));
    dispatch(
      setCurrentFile({
        name: t.file.name,
        path: t.file.path,
        isDirectory: false,
      })
    );
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
        name: "file",
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
      tabs[0].file.name === "file" &&
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

  return { viewTab, removeTab, isActiveTab, tabs }
};
