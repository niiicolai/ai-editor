import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { AppWindow } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ThemeOptionComponent() {
  const theme = useSelector((state: RootState) => state.theme);
  const navigate = useNavigate();

  return (
    <div className="flex justify-start items-center gap-1 highlight-color">
      <AppWindow className="w-3.5 h-3.5" />
      <button
        data-testid="editor-footer-themes-button"
        className="text-xs button-main"
        onClick={() => navigate("/themes")}
      >
        {theme.name}
      </button>
    </div>
  );
}

export default ThemeOptionComponent;
