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

const WEBSITE_DOMAIN_URL = import.meta.env.VITE_WEBSITE_DOMAIN;
if (!WEBSITE_DOMAIN_URL) console.error('CONFIGURATION ERROR(FileOptionsComponent.ts): VITE_WEBSITE_DOMAIN should be set in the .env file');

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
    const f = `temp-file-${new Date().getTime()}`;
    dispatch(
      setFile({
        id: f,
        name: f,
        content: "",
        language: "text",
        path: "temp/"+f,
        isSaved: false, 
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
            data-testid="editor-header-new-file-button"
            onClick={() => handleNewFile()}
            className="button-main w-full text-left px-2 py-1 flex justify-between"
          >
            <span>New File</span>
            <span>{shortcuts.new_file.join(' + ')}</span>
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
            data-testid="editor-header-save-button"
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
                data-testid="editor-header-credit-button"
                onClick={() =>
                  openExternalBrowser(`${WEBSITE_DOMAIN_URL}/products`)
                }
                className="button-main w-full text-left px-2 py-1"
              >
                Credit
              </button>
              <button
                data-testid="editor-header-profile-button"
                onClick={() =>
                  openExternalBrowser(`${WEBSITE_DOMAIN_URL}/user`)
                }
                className="button-main w-full text-left px-2 py-1"
              >
                Profile
              </button>
              <button
                data-testid="editor-header-sign-into-another-account-button"
                onClick={() => navigate("/user/login")}
                className="button-main w-full text-left px-2 py-1"
              >
                Sign into another account
              </button>
            </>
          )}
          {!isAuthorized && (
            <>
              <button
                data-testid="editor-header-login-button"
                onClick={() => navigate("/user/login")}
                className="button-main w-full text-left px-2 py-1"
              >
                Login
              </button>
              <button
                data-testid="editor-header-signup-button"
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
