import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { XIcon } from "lucide-react";
import Scrollbar from "react-scrollbars-custom";

function ShortcutIndexView() {
  const shortcuts = useSelector((state: RootState) => state.shortcuts);
  const shortCutsArray = [];
  for (const key in shortcuts) {
    if (key == "_persist") continue;
    if (key in shortcuts) {
      shortCutsArray.push({
        name: key.replace(/_/g, ' '),
        keys: (shortcuts[key as keyof typeof shortcuts] as string[]).join(" + "),
      });
    }
  }

  return (
    <Scrollbar className="flex min-h-screen main-bgg main-color">
      <div className="w-full p-6">
        <div className="secondary-bgg border border-color shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium main-color" data-testid="shortcuts-title">
                Shortcuts
              </h3>
              <div className="flex justify-start items-center gap-3">
                <Link
                  to="/"
                  data-testid="shortcuts-back-link"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md button-main"
                >
                  <XIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
          {shortCutsArray.map((shortcut: { name: string; keys: string }) => (
            <div
              key={shortcut.name}
              className="px-4 py-5 border-t border-color flex items-center justify-between w-full"
            >
              <div className="flex gap-3 items-center capitalize">
                <span className="font-medium">{shortcut.name}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">{shortcut.keys}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Scrollbar>
  );
}

export default ShortcutIndexView;
