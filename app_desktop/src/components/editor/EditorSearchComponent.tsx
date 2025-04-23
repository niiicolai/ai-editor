import { XIcon } from "lucide-react";
import { FileType, TabType } from "../../types/directoryInfoType";
import Scrollbar from "react-scrollbars-custom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setSearchVisible } from "../../features/editorSearch";

function EditorSearchComponent() {
  const editorSearch = useSelector((state: RootState) => state.editorSearch);
  const dispatch = useDispatch();

  return (
    <div className={`relative ${editorSearch.visible ? '' : 'hidden'}`}>
      <div className="absolute z-50 main-color border-color border-1 shadow-md bottom-0 right-0 left-0 h-64">
        <div className="flex items-center justify-between p-3 border-b border-color">
          <div>
            <h3>Search</h3>
          </div>
          <div>
            <button
              className="main-button"
              onClick={() => dispatch(setSearchVisible(false))}
            >
              <XIcon className="w-4 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorSearchComponent;
