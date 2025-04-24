import { RootState } from "../../store";
import { useSelector } from "react-redux";
import CreditInfoComponent from "./CreditInfoComponent";

function FooterComponent() {
  const theme = useSelector((state: RootState) => state.editorSettings.theme);
  const editor = useSelector((state: RootState) => state.editor);

  return (
    <div className="flex flex-row justify-between items-center gap-3">
      <CreditInfoComponent />

      <div className="flex flex-row justify-start items-center gap-3">
        {editor.file.path && (
          <div className="flex justify-start items-center">
            <p className="text-xs highlight-color">
              Current file path: {editor.file.path}
            </p>
          </div>
        )}

        {editor.file.path && (
          <div className="flex justify-start items-center">
            <p className="text-xs highlight-color">
              Current file path: {editor.file.path}
            </p>
          </div>
        )}

        <div className="flex justify-start items-center">
          <p className="text-xs highlight-color">
            Language: {editor.file.language}
          </p>
        </div>

        <div className="flex justify-start items-center">
          <p className="text-xs highlight-color">Theme: {theme.name}</p>
        </div>
      </div>
    </div>
  );
}

export default FooterComponent;
