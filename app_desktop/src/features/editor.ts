import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileType } from "../types/directoryInfoType";

export interface Editor {
  file: FileType;
  tabSize: number;
  nextEditorCommand: string | null;
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
    tabSize: 4,
    nextEditorCommand: null,
  } as Editor,
  reducers: {
    setFile: (state: any, action: PayloadAction<FileType>) => {
      state.file = action.payload;
    },
    setTabSize: (state: any, action: PayloadAction<number>) => {
      state.tabSize = action.payload;
    },
    setNextEditorCommand: (state: any, action: PayloadAction<string | null>) => {
      state.nextEditorCommand = action.payload;
    },
  },
});

export const { setFile, setTabSize, setNextEditorCommand } = editorSlice.actions;
export default editorSlice.reducer;
