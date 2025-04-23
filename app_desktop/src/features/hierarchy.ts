import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileItemType, DirectoryStateType } from '../types/directoryInfoType';

export interface Directory {
    currentFile: FileItemType | null;
    directoryState: DirectoryStateType;
}

const hierarchySlice = createSlice({
    name: "hierarchy",
    initialState: {
        currentFile: null,
        directoryState: {},
    } as Directory,
    reducers: {
        setCurrentFile: (state: any, action: PayloadAction<FileItemType | null>) => {
            state.currentFile = action.payload;
        },
        setDirectoryState: (state: any, action: PayloadAction<DirectoryStateType>) => {
            state.directoryState = action.payload;
        },
    },
});

export const { setCurrentFile, setDirectoryState } = hierarchySlice.actions;
export default hierarchySlice.reducer;
