import { useState } from "react";
import { FileItemType } from "../types/directoryInfoType";
import { RootState } from "../store";
import { useSelector } from "react-redux";

export const useSearch = () => {
  const [searchFiles, setSearchFiles] = useState<FileItemType[]>([]);
  const hierarchy = useSelector((state: RootState) => state.hierarchy);

  const search = (e: any) => {
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

    setSearchFiles(files);
  };

  return { search, searchFiles };
};
