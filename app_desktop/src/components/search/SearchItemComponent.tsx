import { FileItemType } from "../../types/directoryInfoType";
import { useSelectFile } from "../../hooks/useSelectFile";

function SearchItemComponent({
    file,
    hideSearch
}:{
    file: FileItemType;
    hideSearch: () => void;
}) {
  const selectFile = useSelectFile();
  const handleSelect = () => {
    selectFile.select(file);
    hideSearch();
  }

  return (
    <div key={file.path}>
      <button
        onClick={handleSelect}
        className="cursor-pointer hover:bg-slate-800 highlight-color"
      >
        {file.path}
      </button>
    </div>
  );
}

export default SearchItemComponent;
