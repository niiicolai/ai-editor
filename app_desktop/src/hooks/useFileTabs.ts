import { useEffect } from "react";
import { setFile } from "../features/editor";
import { setCurrentFile } from "../features/hierarchy";
import { useDispatch, useSelector } from "react-redux";
import { TabType } from "../types/fileTabType";
import { RootState } from "../store";
import { setTabs } from "../features/tabs";
import { FileType } from "../types/editorFileType";

export const useFileTabs = () => {
  const { tabs } = useSelector((state: RootState) => state.tabs);
  const editor = useSelector((state: RootState) => state.editor);
  const dispatch = useDispatch();

  const isActiveTab = (t: TabType) => {
    return editor.file.name === t.file.name;
  }

  const closeActiveTab = () => {
    const activeTab = tabs.find((t) => isActiveTab(t));
    if (activeTab) {
      removeTab(activeTab);
    }
  };

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
    const newTabs = [...tabs];
    for (const tab of newTabs) {
      if (tab.file.name === t.file.name) {
        newTabs.splice(i, 1); // Remove the tab at index i
        break;
      }
      i++;
    }
    if (newTabs.length === 0) {
      const dummyFile = {
        id: "",
        name: "file",
        content: "",
        language: "javascript",
        path: "",
      };
      dispatch(setFile(dummyFile));
      dispatch(setTabs([{ file: dummyFile }]));
    } else {
      if (editor.file.name === t.file.name) dispatch(setFile(newTabs[0].file));
      dispatch(setTabs([...newTabs]));
    }
  };

  const updateTabsOnFileOpen = (file: FileType) => {
    if (
      tabs.length === 1 &&
      tabs[0].file.name === "file" &&
      tabs[0].file.content === ""
    ) {
      dispatch(setTabs([{ file }]));
      return;
    }
    for (const tab of tabs) {
      if (tab.file.name === file.name) {
        viewTab({ file });
        return;
      }
    }
    dispatch(setTabs([{ file }, ...tabs]));
  };

  const useEffectUpdateTabs = () => {
    useEffect(() => {
      if (editor.file) {
        updateTabsOnFileOpen(editor.file);
      }
    }, [editor.file]);
  }

  return { viewTab, removeTab, isActiveTab, useEffectUpdateTabs, closeActiveTab, tabs }
};
