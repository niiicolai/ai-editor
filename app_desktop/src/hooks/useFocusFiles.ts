import { setFocusFiles } from "../features/hierarchy";
import { useDispatch, useSelector } from "react-redux";
import { FileItemType, FocusFileItemType } from "../types/directoryInfoType";
import { RootState } from "../store";

export const useFocusFiles = () => {
  const { focusFiles } = useSelector((state: RootState) => state.hierarchy);
  const dispatch = useDispatch();

  const addFile = (f: FileItemType | null, ln: string | null) => {
    if (!f) return;

    dispatch(
      setFocusFiles([
        ...focusFiles,
        {
          file: f,
          lines: ln,
        },
      ])
    );
  };

  const removeFocusFile = (f: FocusFileItemType) => {
    dispatch(
      setFocusFiles(focusFiles.filter((focusFile) => focusFile.file !== f.file))
    );
  };

  return {
    focusFiles,
    addFile,
    removeFocusFile
  };
};
