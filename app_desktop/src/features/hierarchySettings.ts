import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const hierarchySettingsSlice = createSlice({
    name: "hierarchySettings",
    initialState: {
        minimized: false
    },
    reducers: {
        setHierarchyMinimized: (state: any, action: PayloadAction<boolean>) => {
            state.hierarchy.minimized = action.payload;
        },
    },
});

const persistConfig = {
    key: 'hierarchySettings', // key for storage
    storage,     // storage engine (localStorage in this case)
};

export const hierarchySettingsActions = hierarchySettingsSlice.actions;
export default persistReducer(persistConfig, hierarchySettingsSlice.reducer);
