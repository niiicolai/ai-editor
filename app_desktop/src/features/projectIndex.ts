import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectIndexType, ProjectIndexItemType, ProjectIndexMetaType } from "../types/projectIndexType";

const projectIndexSlice = createSlice({
    name: "project_index",
    initialState: {
        meta: null,
        items: {} as ProjectIndexItemType,
        isLoading: false,
    } as ProjectIndexType,
    reducers: {
        setMeta: (state: any, action: PayloadAction<ProjectIndexMetaType | null>) => {
            state.meta = action.payload;
        },
        setIsLoading: (state: any, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setItems: (state: any, action: PayloadAction<ProjectIndexItemType>) => {
            state.items = action.payload;
        },
    },
});

export const { setMeta, setItems, setIsLoading } = projectIndexSlice.actions;
export default projectIndexSlice.reducer;
