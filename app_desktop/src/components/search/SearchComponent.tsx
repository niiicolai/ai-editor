import { SearchIcon, XIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setSearchVisible } from "../../features/editorSearch";
import { FileItemType } from "../../types/directoryInfoType";
import { useState } from "react";
import { setFile } from "../../features/editor";
import { setCurrentFile } from "../../features/hierarchy";
import { useGetLanguage } from "../../hooks/useGetLanguage";
import { useFiles } from "../../hooks/useFiles";

function SearchComponent() {
  const [searchResult, setSearchResult] = useState<FileItemType[]>([]);
  const editorSearch = useSelector((state: RootState) => state.editorSearch);
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const { getLanguageFromFile } = useGetLanguage();
  const dispatch = useDispatch();
  const files = useFiles();

  const onSearch = (e: any) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const searchInput = formData.get("search");
    const maxResults = 5;

    const files = [] as FileItemType[];
    for (const key in hierarchy.directoryState) {
      const directory = hierarchy.directoryState[key];
      for (const f of directory.files) {
        if (f.name.match(new RegExp(searchInput as string))) {
          files.push(f);
          if (files.length > maxResults) break;
        }
      }

      if (files.length > maxResults) break;
    }

    setSearchResult(files);
  };

  const openFile = async (file: FileItemType) => {
    const content = await files.readFile(file.path);
    dispatch(setCurrentFile(file));
    dispatch(
      setFile({
        id: file.path,
        path: file.path,
        name: file.name,
        content: content || "",
        language: getLanguageFromFile(file.name),
      })
    );
    dispatch(setSearchVisible(false));
  };

  return (
    <div className={`relative ${editorSearch.visible ? "" : "hidden"}`}>
      <div className="fixed w-96 z-50 flex flex-col main-color border-color border-1 main-bgg shadow-md left-3 top-3 h-64">
        <div className="flex items-center justify-between gap-1 p-2 border-b border-color">
          <div className="flex-1">
            <form className="flex w-full" onSubmit={onSearch}>
              <input
                type="text"
                placeholder="Enter a keyword"
                className="flex-1 w-full focus:outline-none highlight-color"
                name="search"
              />
              <button
                type="submit"
                className="button-main cursor-pointer p-1 rounded-full"
              >
                <SearchIcon className="w-4 h-4" />
              </button>
            </form>
          </div>
          <div>
            <button
              className="button-main flex items-center justify-center cursor-pointer p-1 rounded-full"
              onClick={() => dispatch(setSearchVisible(false))}
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-3 flex-1 flex flex-col gap-1 text-xs">
          {searchResult.map((file: FileItemType) => (
            <div key={file.path}>
              <button
                onClick={() => openFile(file)}
                className="cursor-pointer hover:bg-slate-800 highlight-color"
              >
                {file.path}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchComponent;
