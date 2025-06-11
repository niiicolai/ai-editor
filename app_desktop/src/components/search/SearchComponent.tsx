import { SearchIcon, XIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setSearchVisible } from "../../features/search";
import { FileItemType } from "../../types/directoryInfoType";
import { useSearch } from "../../hooks/useSearch";
import SearchItemComponent from "./SearchItemComponent";

function SearchComponent() {
  const { searchFiles, search } = useSearch();
  const { visible } = useSelector((state: RootState) => state.search);
  const dispatch = useDispatch();
  const hideSearch = () => dispatch(setSearchVisible(false));

  return (
    <div className={`relative ${visible ? "" : "hidden"}`} data-testid="editor-header-search-wrapper">
      <div className="fixed w-96 z-50 flex flex-col main-color border-color border-1 main-bgg shadow-md left-3 top-3 h-64">
        <div className="flex items-center justify-between gap-1 p-2 border-b border-color">
          <div className="flex-1">
            <form className="flex w-full" onSubmit={search}>
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
              data-testid="editor-header-search-close-button"
              className="button-main flex items-center justify-center cursor-pointer p-1 rounded-full"
              onClick={hideSearch}
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-3 flex-1 flex flex-col gap-1 text-xs">
          {searchFiles.map((file: FileItemType) => (
            <SearchItemComponent key={file.path} file={file} hideSearch={hideSearch} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchComponent;
