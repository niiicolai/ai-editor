import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useWriteFile } from "../../hooks/useFiles";
import { setFile } from "../../features/editor";
import { useExternalBrowser } from "../../hooks/useExternalBrowser";
import { useOpenFolder } from "../../hooks/useOpenFolder";
import { useOpenFile } from "../../hooks/useOpenFile";
import { useIsAuthorized } from "../../hooks/useUser";
import { useSaveAs } from "../../hooks/useSaveAs";
import { useHotkeys } from 'react-hotkeys-hook';

import DropdownComponent from "../utils/DropdownComponent";

function FileOptionsComponent() {
  const { data: isAuthorized } = useIsAuthorized();
  const { openExternalBrowser } = useExternalBrowser();
  const editor = useSelector((state: RootState) => state.editor);
  const shortcuts = useSelector((state: RootState) => state.shortcuts);
  const openFolder = useOpenFolder();
  const openFile = useOpenFile();
  const writeFile = useWriteFile();
  const saveAs = useSaveAs();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSave = () => {
    if (!editor.file.path && !editor.file.name) return;
    writeFile.mutateAsync(editor.file.path, editor.file.content);
  };

  const handleSaveAs = () => {
    if (!editor.file.path && !editor.file.name) return;
    saveAs.saveAs(editor.file.name, editor.file.content);
  };

  const handleShortcutSave = () => {
    if (!editor.file.id) saveAs.saveAs(editor.file.name, editor.file.content);
    else writeFile.mutateAsync(editor.file.path, editor.file.content);
  };

  const handleNewFile = () => {
    dispatch(
      setFile({
        id: `temp-file-${new Date().getTime()}`,
        name: `temp-file-${new Date().getTime()}`,
        content: "",
        language: "text",
        path: "",
      })
    )
  }

  useHotkeys(shortcuts.save.join('+'), () => handleShortcutSave(), {}, [handleShortcutSave, editor, saveAs, writeFile])
  useHotkeys(shortcuts.open_directory.join('+'), () => openFolder.open(), {}, [openFolder])
  useHotkeys(shortcuts.open_file.join('+'), () => openFile.open(), {}, [openFile])
  useHotkeys(shortcuts.new_file.join('+'), () => handleNewFile(), {}, [handleNewFile])

  return (
    <DropdownComponent
      id="header-file-drop-down"
      className="w-64"
      buttonText="File"
      slot={
        <div className="relative">
          <button
            onClick={() => handleNewFile()}
            className="button-main w-full text-left px-2 py-1 flex justify-between"
          >
            <span>New File</span>
            <span>{shortcuts.new_file.join(' + ')}</span>
          </button>
          <button
            onClick={() => console.log('not implemented')}
            className="button-main w-full text-left px-2 py-1 flex justify-between"
          >
            <span>New Window</span>
            <span>{shortcuts.new_window.join(' + ')}</span>
          </button>
          <hr className="border-color" />
          <button
            onClick={() => openFolder.open()}
            className="button-main w-full text-left px-2 py-1 flex justify-between"
          >
            <span>Open Folder</span>
            <span>{shortcuts.open_directory.join(' + ')}</span>
          </button>
          <button
            onClick={() => openFile.open()}
            className="button-main w-full text-left px-2 py-1 flex justify-between"
          >
            <span>Open File</span>
            <span>{shortcuts.open_file.join(' + ')}</span>
          </button>
          <hr className="border-color" />
          <button
            onClick={() => handleSave()}
            className="button-main w-full text-left px-2 py-1 flex justify-between"
          >
            <span>Save</span>
            <span>{shortcuts.save.join(' + ')}</span>
          </button>
          <button
            onClick={() => handleSaveAs()}
            className="button-main w-full text-left px-2 py-1 flex justify-between"
          >
            <span>Save As</span>
            <span>{shortcuts.save.join(' + ')}</span>
          </button>
          <hr className="border-color" />
          {isAuthorized && (
            <>
              <button
                onClick={() =>
                  openExternalBrowser("http://localhost:5173/products")
                }
                className="button-main w-full text-left px-2 py-1"
              >
                Credit
              </button>
              <button
                onClick={() =>
                  openExternalBrowser("http://localhost:5173/user")
                }
                className="button-main w-full text-left px-2 py-1"
              >
                Profile
              </button>
            </>
          )}
          {!isAuthorized && (
            <>
              <button
                onClick={() => navigate("/user/login")}
                className="button-main w-full text-left px-2 py-1"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/user/signup")}
                className="button-main w-full text-left px-2 py-1"
              >
                Signup
              </button>
            </>
          )}
        </div>
      }
    />
  );
}

export default FileOptionsComponent;
