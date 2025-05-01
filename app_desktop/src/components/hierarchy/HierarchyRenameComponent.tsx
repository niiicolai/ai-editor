import { Folder, File, Check, XIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setRenameFileItem } from "../../features/hierarchy";
import { useState } from "react";
import { useRenameDir } from "../../hooks/useRenameDir";
import { useRenameFile } from "../../hooks/useRenameFile";

function HierarchyRenameComponent({ path }: { path: string }) {
  const [error, setError] = useState("");
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const isActive = hierarchy?.renameFileItem?.path == path;
  const renameDir = useRenameDir();
  const renameFile = useRenameFile();
  const dispatch = useDispatch();

  const handleRenameNewItem = async (e:any) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get('name')?.toString();
    const isDir = hierarchy?.renameFileItem?.isDirectory;

    if (!name) return setError('Name is required');

    try {
        if (isDir) await renameDir.rename(path, name);
        else await renameFile.rename(path, name);
        dispatch(setRenameFileItem(null));
    } catch {
        setError("Something went wrong");
    }
  }

  return (
    <>
      {isActive && (
        <div className="w-full flex main-color relative">
            {error && (
                <div className="absolute -top-6 left-8 bg-red-700 text-black text-xs p-1">
                    {error}
                </div>
            )}
          <div className="px-2 py-1 flex">
            {hierarchy?.newFileItem?.isDirectory
                ? <Folder className="w-4 h-4" />
                : <File className="w-4 h-4" />
            }
          </div>

          <form className="flex w-full" onSubmit={handleRenameNewItem}>
            <input
                type="text"
                name="name"
                className="px-3 w-full text-sm focus:outline-none secondary-bgg"
            />
            <button className="p-1 button-main" type="submit">
                <Check className="w-4 h-4" />
            </button>
            <button className="p-1 button-main" type="button" onClick={() => dispatch(setRenameFileItem(null))}>
                <XIcon className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default HierarchyRenameComponent;
