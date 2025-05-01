import { Link } from "react-router-dom";
import { XIcon } from "lucide-react";
import Scrollbar from "react-scrollbars-custom";

function ExtensionIndexView() {

  return (
    <Scrollbar className="flex min-h-screen main-bgg main-color">
      <div className="w-full p-6">
        <div className="secondary-bgg border border-color shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium main-color">
              Extensions
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
        </div>
      </div>
    </Scrollbar>
  );
}

export default ExtensionIndexView;
