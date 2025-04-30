import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useWriteFile } from "../../hooks/useFiles";
import { setFile } from "../../features/editor";
import { useExternalBrowser } from "../../hooks/useExternalBrowser";
import { useOpenFolder } from "../../hooks/useOpenFolder";
import { useOpenFile } from "../../hooks/useOpenFile";
import { useIsAuthorized } from "../../hooks/useUser";
import DropdownComponent from "../utils/DropdownComponent";

function FileOptionsComponent() {
  const { data: isAuthorized } = useIsAuthorized();
  const { openExternalBrowser } = useExternalBrowser();
  const editor = useSelector((state: RootState) => state.editor);
  const openFolder = useOpenFolder();
  const openFile = useOpenFile();
  const writeFile = useWriteFile();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSave = () => {
    if (!editor.file.path && !editor.file.name) return;
    writeFile.mutateAsync(editor.file.path, editor.file.content);
  };

  return (
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
          <hr className="border-color" />
          <button
            onClick={() => openExternalBrowser("http://localhost:5173/docs")}
            className="button-main w-full text-left px-2 py-1"
          >
            Documentation
          </button>
        </div>
      }
    />
  );
}

export default FileOptionsComponent;
