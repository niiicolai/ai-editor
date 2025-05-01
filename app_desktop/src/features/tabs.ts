import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TabType, TabMenuType } from '../types/directoryInfoType';

export interface Tabs {
    tabs: TabType[];
    inspectorMenu: TabMenuType | null;
}

const tabsSlice = createSlice({
    name: "tabs",
    initialState: {
        tabs: [],
        inspectorMenu: null,
    } as Tabs,
    reducers: {
        setTabs: (state: any, action: PayloadAction<TabType[]>) => {
            state.tabs = action.payload;
        },
        setInspectorMenu: (state: any, action: PayloadAction<TabMenuType | null>) => {
            state.inspectorMenu = action.payload;
        },
    },
});

export const { setTabs, setInspectorMenu } = tabsSlice.actions;
export default tabsSlice.reducer;
