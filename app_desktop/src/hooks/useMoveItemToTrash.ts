import { setCurrentFile, setDirectoryState } from "../features/hierarchy";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { moveItemToTrash } from "../electron/moveItemToTrash";
import { setFile } from "../features/editor";
import { RootState } from "../store";
import { setTabs } from "../features/tabs";

export const useMoveItemToTrash = () => {
  const [isLoading, setIsLoading] = useState(false);
  const editor = useSelector((state: RootState) => state.editor);
  const fileTabs = useSelector((state: RootState) => state.tabs);
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const dispatch = useDispatch();

  const trashItem = async (path: string, isDirectory: boolean) => {
    setIsLoading(true);
    try {
      await moveItemToTrash(path);

      // Update the file in the hierarchy state
      const parentDirPath = path.split("\\").slice(0, -1).join("\\");
      const files = hierarchy.directoryState[parentDirPath].files.filter(
        (file) => file.path !== path
      );
      const newDirectoryState = {
        ...hierarchy.directoryState,
        [parentDirPath]: {
          isOpen: hierarchy.directoryState[parentDirPath].isOpen,
          files,
        },
      };
      if (isDirectory) {
        delete newDirectoryState[path];
      }
      dispatch(setDirectoryState(newDirectoryState));

      // Update the file in the editor state
      if (editor.file.path === path) {
        const f = `temp-file-${new Date().getTime()}`;
        const dummyFile = {
          id: f,
          name: f,
          content: "",
          language: "javascript",
          path: "temp/"+f,
          isSaved: false,
        };
        dispatch(setFile(dummyFile));
        dispatch(setCurrentFile(null));
      }

      // Update the file in the tabs state
      const updatedTabs = fileTabs.tabs.filter((tab) => tab.file.path !== path);
      dispatch(setTabs(updatedTabs));
    } catch (error) {
      console.error("Error moving item to trash:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, trashItem };
};
