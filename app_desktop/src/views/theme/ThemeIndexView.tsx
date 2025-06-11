import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../features/theme";
import { RootState } from "../../store";
import { Check, XIcon } from "lucide-react";
import Scrollbar from "react-scrollbars-custom";
import themesJson from "../../assets/themes.json";

function ThemeIndexView() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);

  return (
    <Scrollbar className="flex min-h-screen main-bgg main-color">
      <div className="w-full p-6">
        <div className="secondary-bgg border border-color shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium main-color" data-testid="themes-title">
                Themes
              </h3>
              <div className="flex justify-start items-center gap-3">
                <Link
                  to="/"
                  data-testid="themes-back-link"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md button-main"
                >
                  <XIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
          {themesJson.map((t: any) => (
            <div key={t.name} className="px-4 py-5 border-t border-color flex items-center justify-between w-full">
                <div className="flex gap-3 items-center">
                    {t.name}
                </div>
                <div>
                    {theme.name === t.name && (
                        <Check className="w-4 h-4" data-testid={`active-theme-${t.name.replace(/ /,'-')}`} />
                    )}
                    {theme.name !== t.name && (
                        <button
                        disabled={theme.name == t.name} 
                        data-testid={`select-theme-${t.name.replace(/ /,'-')}`}
                        className="button-main" onClick={() => dispatch(setTheme(t.name))}>
                            Select
                        </button>
                    )} 
                </div>
            </div>
          ))}
        </div>
      </div>
    </Scrollbar>
  );
}

export default ThemeIndexView;
