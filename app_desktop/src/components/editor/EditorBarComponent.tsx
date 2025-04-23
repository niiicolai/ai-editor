import { Cog, Save, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useFiles } from "../../hooks/useFiles";
import { useState } from "react";
import { setSearchVisible } from "../../features/editorSearch";

function EditorBarComponent() {
  const theme = useSelector((state: RootState) => state.editorSettings.theme);
  const search = useSelector((state: RootState) => state.editorSettings.search);
  const editor = useSelector((state: RootState) => state.editor);
  const [isPendingSave, setIsPendingSave] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const files = useFiles();

  const handleSave = async () => {
    if (!editor.file.path) return;
    setIsPendingSave(true);
    try {
      await files.writeFile(editor.file.path, editor.file.content);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsPendingSave(false);
    }
  };

  return (
    <div className="shadow-sm lg:h-12 border-t border-color flex justify-start items-center w-full">
      <div className="px-3 py-3 lg:py-1 w-full">
        <div className="flex flex-col lg:flex-row justify-start lg:items-center gap-3">
          <div className="flex gap-3 justify-start items-center">
            <button
              onClick={handleSave}
              disabled={isPendingSave}
              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPendingSave ? (
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <Save className="h-4 w-4" />
              )}
            </button>
            {!search.disabled && (
              <button
                onClick={() => dispatch(setSearchVisible(true))}
                className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => navigate("/settings")}
              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPendingSave ? (
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <Cog className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="flex flex-row justify-start items-center gap-3">
            <div className="pl-3 lg:border-l border-color flex justify-start items-center">
              <p className="text-xs highlight-color">
                Language: {editor.file.language}
              </p>
            </div>

            <div className="pl-3 lg:border-l border-color flex justify-start items-center">
              <p className="text-xs highlight-color">Theme: {theme.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorBarComponent;
