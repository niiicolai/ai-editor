import { RootState } from "../../store";
import { useSelector } from "react-redux";
import CreditInfoComponent from "./CreditInfoComponent";
import { AppWindow, Code, FolderIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

function FooterComponent() {
  const theme = useSelector((state: RootState) => state.editorSettings.theme);
  const editor = useSelector((state: RootState) => state.editor);
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const navigate = useNavigate();

  return (
    <footer className="px-3 py-1 border-color border-t main-bgg">
      <div className="flex flex-row justify-between items-center gap-3">
        <CreditInfoComponent />

        <div className="flex flex-row justify-start items-center gap-3 text-xs highlight-color">
          {hierarchy.currentPath && (
            <div className="flex justify-start items-center gap-1">
              <FolderIcon className="w-3.5 h-3.5" />
              <p>{hierarchy.currentPath}</p>
            </div>
          )}

          <div className="flex justify-start items-center gap-1">
            <Code className="w-3.5 h-3.5" />
            <p>{editor.file.language}</p>
          </div>

          <div className="flex justify-start items-center gap-1 highlight-color">
            <AppWindow className="w-3.5 h-3.5" />
            <button className="text-xs button-main" onClick={() => navigate("/themes")}>
              {theme.name}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterComponent;
