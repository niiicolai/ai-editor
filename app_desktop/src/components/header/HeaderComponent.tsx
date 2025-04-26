import {
  Cog,
  Save,
  Search,
  LoaderIcon,
  Info,
  ShoppingBag,
  User,
  XIcon,
  Minus,
  Copy,
  Computer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useWriteFile } from "../../hooks/useFiles";
import { setSearchVisible } from "../../features/editorSearch";
import { useExternalBrowser } from "../../hooks/useExternalBrowser";
import { useWindow } from "../../hooks/useWindow";

import SearchComponent from "../search/SearchComponent";

function HeaderComponent() {
  const search = useSelector((state: RootState) => state.editorSettings.search);
  const editor = useSelector((state: RootState) => state.editor);
  const { openExternalBrowser } = useExternalBrowser();
  const win = useWindow();
  const writeFile = useWriteFile();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="flex gap-3 justify-between items-center">
      <div className="flex-1 flex gap-1 justify-start items-center text-orange-500 draggable-region">
        <Computer className="w-4 h-4" />
      </div>

      <div className="flex gap-1 justify-end items-center">
        <div className="flex gap-1 justify-end items-center mr-24">
          <button
            title="Save"
            onClick={() =>
              writeFile.mutateAsync(editor.file.path, editor.file.content)
            }
            disabled={writeFile.isPending}
            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {writeFile.isPending ? (
              <LoaderIcon className="h-3 w-3" />
            ) : (
              <Save className="h-3 w-3" />
            )}
          </button>
          {!search.disabled && (
            <button
              title="Search"
              onClick={() => dispatch(setSearchVisible(true))}
              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="h-3 w-3" />
            </button>
          )}
          <button
            title="Settings"
            onClick={() => navigate("/settings")}
            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Cog className="h-3 w-3" />
          </button>
        </div>

        <button
          title="Documentation"
          onClick={() => openExternalBrowser("http://localhost:5173/docs")}
          className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Info className="h-3 w-3" />
        </button>
        <button
          title="Buy Credit"
          onClick={() => openExternalBrowser("http://localhost:5173/products")}
          className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="h-3 w-3" />
        </button>
        <button
          title="Profile"
          onClick={() => openExternalBrowser("http://localhost:5173/user")}
          className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <User className="h-3 w-3" />
        </button>
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
  );
}

export default HeaderComponent;
