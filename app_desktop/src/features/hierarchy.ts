import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileItemType, DirectoryStateType, FileMenuType } from '../types/directoryInfoType';

export interface Directory {
    currentPath: string | null;
    currentFile: FileItemType | null;
    newFileItem: FileItemType | null;
    directoryState: DirectoryStateType;
    inspectorMenu: FileMenuType | null;
}

const hierarchySlice = createSlice({
    name: "hierarchy",
    initialState: {
        directoryState: {},
        currentPath: null,
        currentFile: null,
        newFileItem: null,
        inspectorMenu: null,
    } as Directory,
    reducers: {
        setCurrentFile: (state: any, action: PayloadAction<FileItemType | null>) => {
            state.currentFile = action.payload;
        },
        setDirectoryState: (state: any, action: PayloadAction<DirectoryStateType | null>) => {
            state.directoryState = action.payload;
        },
        setCurrentPath: (state: any, action: PayloadAction<string | null>) => {
            state.currentPath = action.payload;
        },
        setInspectorMenu: (state: any, action: PayloadAction<FileMenuType | null>) => {
            state.inspectorMenu = action.payload;
        },
        setNewFileItem: (state: any, action: PayloadAction<FileItemType | null>) => {
            state.newFileItem = action.payload;
        },
    },
});

export const { setCurrentFile, setDirectoryState, setCurrentPath, setInspectorMenu, setNewFileItem } = hierarchySlice.actions;
export default hierarchySlice.reducer;
