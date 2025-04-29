import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editorSettingsActions } from "../../features/editorSettings";
import { RootState } from "../../store";
import { Check, XIcon } from "lucide-react";

const themes = [
  { id: "vs-light", name: "Light" },
  { id: "vs-dark", name: "Dark" },
  { id: "hc-light", name: "High Contrast Light" },
  { id: "hc-black", name: "High Contrast Dark" },
];

function ThemeIndexView() {
  const dispatch = useDispatch();
  const editorSettings = useSelector(
    (state: RootState) => state.editorSettings
  );

  return (
    <div className="flex min-h-screen main-bgg main-color p-6">
      <div className="w-full">
        <div className="secondary-bgg border border-color shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium main-color">
                Themes
              </h3>
              <div className="flex justify-start items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md button-main"
                >
                  <XIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
          {themes.map((t: any) => (
            <div key={t.id} className="px-4 py-5 border-t border-color flex items-center justify-between w-full">
                <div className="flex gap-3 items-center">
                    {t.name}
                </div>
                <div>
                    {editorSettings.theme.name === t.name && (
                        <Check className="w-4 h-4" />
                    )}
                    {editorSettings.theme.name !== t.name && (
                        <button
                        disabled={editorSettings.theme.name == t.name} 
                        className="button-main" onClick={() => dispatch(editorSettingsActions.setTheme(t))}>
                            Select
                        </button>
                    )} 
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ThemeIndexView;
