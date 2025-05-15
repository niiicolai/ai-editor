import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ProjectIndexType,
  ProjectIndexItemType,
  ProjectIndexMetaType,
} from "../types/projectIndexType";
import { FileItemType } from "../types/directoryInfoType";

const projectIndexSlice = createSlice({
  name: "project_index",
  initialState: {
    meta: null,
    queue: [] as FileItemType[],
    items: {} as ProjectIndexItemType,
    isLoading: false,
  } as ProjectIndexType,
  reducers: {
    setMeta: (
      state: any,
      action: PayloadAction<ProjectIndexMetaType | null>
    ) => {
      state.meta = action.payload;
    },
    setIsLoading: (state: any, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setItems: (state: any, action: PayloadAction<ProjectIndexItemType>) => {
      state.items = action.payload;
    },
    addToQueue: (state: any, action: PayloadAction<FileItemType>) => {
      state.queue.push(action.payload);
    },
    setQueue: (state: any, action: PayloadAction<FileItemType[]>) => {
      state.queue = action.payload;
    },
  },
});

export const { 
    setMeta, 
    setItems, 
    setIsLoading, 
    addToQueue, 
    setQueue,
} = projectIndexSlice.actions;
export default projectIndexSlice.reducer;
