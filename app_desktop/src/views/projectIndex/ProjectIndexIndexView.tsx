import { Link } from "react-router-dom";
import { XIcon } from "lucide-react";
import Scrollbar from "react-scrollbars-custom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

function ProjectIndexIndexView() {
  const projectIndex = useSelector((state: RootState) => state.projectIndex);
  const hierarchy = useSelector((state: RootState) => state.hierarchy);

  return (
    <Scrollbar className="flex min-h-screen main-bgg main-color">
      <div className="w-full p-6">
        <div className="secondary-bgg border border-color shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-color">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium main-color">
                Project Index: {hierarchy.currentPath}
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

          <div className="flex flex-col justify-start gap-3">
            {Object.entries(projectIndex.items).map(([key, value]) => (
              <div key={key} className="px-4 py-2 border-b border-color">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium main-color">{key}</h4>
                  <p className="text-sm text-gray-500">{value.name}</p>
                </div>
                <p className="text-xs text-gray-400">
                  Description: {value.description}
                </p>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-400">
                    Language: {value.language}
                  </p>
                  <p className="text-xs text-gray-400">Lines: {value.lines}</p>
                  <div className="text-xs text-gray-400">
                    <p>
                      Vars:{" "}
                      {value.vars.length === 0 && (
                        <span className="text-xs text-gray-400">
                          No variables found
                        </span>
                      )}
                    </p>

                    {value.vars.length > 0 && (
                      <ul className="list-disc list-inside pl-4">
                        {value.vars.map((variable, index) => (
                          <li key={index}>{variable.name}: {variable.line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    <p>
                      Functions:{" "}
                      {value.functions.length === 0 && (
                        <span className="text-xs text-gray-400">
                          No functions found
                        </span>
                      )}
                    </p>
                    {value.functions.length > 0 && (
                      <ul className="list-disc list-inside pl-4">
                        {value.functions.map((fn, index) => (
                          <li key={index}>{fn.name}: {fn.line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    <p>
                      Classes:{" "}
                      {value.classes.length === 0 && (
                        <span className="text-xs text-gray-400">
                          No classes found
                        </span>
                      )}
                    </p>
                    {value.classes.length > 0 && (
                      <ul className="list-disc list-inside pl-4">
                        {value.classes.map((cls, index) => (
                          <li key={index}>{cls.name}: {cls.line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    Hash: {value.hashCode}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Scrollbar>
  );
}

export default ProjectIndexIndexView;
