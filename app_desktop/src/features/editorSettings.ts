import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

type Theme = {
    id: string;
    name: string;
};

export interface EditorSettings {
    theme: Theme
    search: { disabled: boolean; }
}

const editorSettingsSlice = createSlice({
    name: "editorSettings",
    initialState: {
        theme: { id: 'vs-dark', name: 'Dark' } as Theme,
        hierarchy: { minimized: false },
        search: { disabled: false },
    },
    reducers: {
        setTheme: (state: any, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
        },
        setSearchDisabled: (state: any, action: PayloadAction<boolean>) => {
            state.search.disabled = action.payload;
        },
        setHierarchyMinimized: (state: any, action: PayloadAction<boolean>) => {
            state.hierarchy.minimized = action.payload;
        },
    },
});

const persistConfig = {
    key: 'editorSettings', // key for storage
    storage,     // storage engine (localStorage in this case)
};

export const editorSettingsActions = editorSettingsSlice.actions;
export default persistReducer(persistConfig, editorSettingsSlice.reducer);
