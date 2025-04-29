import { XIcon, Minus, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useWriteFile } from "../../hooks/useFiles";
import { setSearchVisible } from "../../features/editorSearch";
import { editorSettingsActions } from "../../features/editorSettings";
import { setFile } from "../../features/editor";
import { useExternalBrowser } from "../../hooks/useExternalBrowser";
import { useWindow } from "../../hooks/useWindow";
import { useOpenFolder } from "../../hooks/useOpenFolder";
import { useOpenFile } from "../../hooks/useOpenFile";

import DropdownComponent from "../utils/DropdownComponent";
import SearchComponent from "../search/SearchComponent";
import { useIsAuthorized } from "../../hooks/useUser";

function HeaderComponent() {
  const { data: isAuthorized } = useIsAuthorized();
  const openFolder = useOpenFolder();
  const openFile = useOpenFile();
  const editorSettings = useSelector(
    (state: RootState) => state.editorSettings
  );
  const editor = useSelector((state: RootState) => state.editor);
  const { openExternalBrowser } = useExternalBrowser();
  const win = useWindow();
  const writeFile = useWriteFile();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSave = () => {
    if (!editor.file.path && !editor.file.name) return;
    writeFile.mutateAsync(editor.file.path, editor.file.content);
  };

  return (
    <header className="p-2 border-color border-b main-bgg">
      <div className="flex gap-3 justify-between items-center">
        <div className="flex gap-4 justify-start items-center ">
          <div className="flex gap-3 text-sm">
            <DropdownComponent
              id="header-file-drop-down"
              className="w-48"
              buttonText="File"
              slot={
                <div className="relative">
                  <button
                    onClick={() =>
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
                    className="button-main w-full text-left px-2 py-1"
                  >
                    New File
                  </button>
                  <hr className="border-color" />
                  <button
                    onClick={() => openFolder.open()}
                    className="button-main w-full text-left px-2 py-1"
                  >
                    Open Folder
                  </button>
                  <button
                    onClick={() => openFile.open()}
                    className="button-main w-full text-left px-2 py-1"
                  >
                    Open file
                  </button>
                  <hr className="border-color" />
                  <button
                    onClick={() => handleSave()}
                    className="button-main w-full text-left px-2 py-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleSave()}
                    className="button-main w-full text-left px-2 py-1"
                  >
                    Save As
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
                        onClick={() =>
                          navigate("/user/login")
                        }
                        className="button-main w-full text-left px-2 py-1"
                      >
                        Login
                      </button>
                      <button
                        onClick={() =>
                          navigate("/user/signup")
                        }
                        className="button-main w-full text-left px-2 py-1"
                      >
                        Signup
                      </button>
                    </>
                  )}
                  <hr className="border-color" />
                  <button
                    onClick={() =>
                      openExternalBrowser("http://localhost:5173/docs")
                    }
                    className="button-main w-full text-left px-2 py-1"
                  >
                    Documentation
                  </button>
                </div>
              }
            />
            <DropdownComponent
              id="header-edit-drop-down"
              className="w-48"
              buttonText="Edit"
              slot={
                <>
                  <button
                    onClick={() => console.log("not implemented")}
                    className="button-main w-full text-left px-2 py-1"
                  >
                    Undo
                  </button>
                  <button
                    onClick={() => console.log("not implemented")}
                    className="button-main w-full text-left px-2 py-1"
                  >
                    Redo
                  </button>
                  <hr className="border-color" />
                  <button
                    onClick={() => console.log("not implemented")}
                    className="button-main w-full text-left px-2 py-1"
                  >
                    Cut
                  </button>
                  <button
                    onClick={() => console.log("not implemented")}
                    className="button-main w-full text-left px-2 py-1"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => console.log("not implemented")}
                    className="button-main w-full text-left px-2 py-1"
                  >
                    Paste
                  </button>
                  <hr className="border-color" />
                  <button
                    onClick={() => dispatch(setSearchVisible(true))}
                    className="button-main w-full text-left px-2 py-1"
                  >
                    Find
                  </button>
                </>
              }
            />
            <DropdownComponent
              id="header-selection-drop-down"
              className="w-48"
              buttonText="Selection"
              slot={
                <>
                  <button
                    onClick={() => handleSave()}
                    className="button-main w-full text-left px-2 py-1"
                  >
                    Select All
                  </button>
                  <hr className="border-color" />
                  <button
                    onClick={() => handleSave()}
                    className="button-main w-full text-left px-2 py-1"
                  >
                    Close Tab
                  </button>
                </>
              }
            />
            <DropdownComponent
              id="header-view-drop-down"
              className="w-48"
              buttonText="View"
              slot={
                <>
                  <button
                    onClick={() => navigate("/themes")}
                    className="button-main w-full text-left px-2 py-1"
                  >
                    Themes
                  </button>
                  <hr className="border-color" />
                  <button
                    onClick={() =>
                      dispatch(
                        editorSettingsActions.setHierarchyMinimized(
                          !editorSettings.hierarchy.minimized
                        )
                      )
                    }
                    className="button-main w-full text-left px-2 py-1"
                  >
                    {editorSettings.hierarchy.minimized
                      ? "Show Explorer"
                      : "Hide Explorer"}
                  </button>
                  <hr className="border-color" />
                  <button
                    onClick={() =>
                      dispatch(
                        editorSettingsActions.setTerminalDisabled(
                          !editorSettings.terminal.disabled
                        )
                      )
                    }
                    className="button-main w-full text-left px-2 py-1"
                  >
                    {editorSettings.terminal.disabled
                      ? "Enable Terminal"
                      : "Disable Terminal"}
                  </button>
                  {!editorSettings.terminal.disabled && (
                    <button
                      onClick={() =>
                        dispatch(
                          editorSettingsActions.setTerminalMinimized(
                            !editorSettings.hierarchy.minimized
                          )
                        )
                      }
                      className="button-main w-full text-left px-2 py-1"
                    >
                      {editorSettings.terminal.minimized
                        ? "Show Terminal"
                        : "Hide Terminal"}
                    </button>
                  )}
                </>
              }
            />
          </div>
        </div>
        <div className="flex-1 h-full w-full p-3 secondary-bgg rounded-md draggable-region"></div>

        <div className="flex gap-1 justify-end items-center">
          <button
            title="Minimize"
            onClick={() => win.minimizeWindow()}
            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="h-3 w-3" />
          </button>
          <button
            title="Restore"
            onClick={() => win.restoreWindow()}
            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Copy className="h-3 w-3" />
          </button>
          <button
            title="Close"
            onClick={() => win.closeWindow()}
            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XIcon className="h-3 w-3" />
          </button>

          <SearchComponent />
        </div>
      </div>
    </header>
  );
}

export default HeaderComponent;
