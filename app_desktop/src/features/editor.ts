import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileType } from "../types/directoryInfoType";

export interface Editor {
  file: FileType;
}

const editorSlice = createSlice({
  name: "editor",
  initialState: {
    file: {
      id: "",
      name: "file",
      content: "",
      language: "javascript",
      path: "",
    },
  } as Editor,
  reducers: {
    setFile: (state: any, action: PayloadAction<FileType>) => {
      state.file = action.payload;
    },
  },
});

export const { setFile } = editorSlice.actions;
export default editorSlice.reducer;
