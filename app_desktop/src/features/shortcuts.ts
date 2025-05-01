import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const shortcutsSlice = createSlice({
    name: "shortcuts",
    initialState: {
        save: ['ctrl', 's'],
        copy: ['ctrl', 'c'],
        cut: ['ctrl', 'x'],
        paste: ['ctrl', 'v'],
        select_all: ['ctrl', 'a'],
        new_file: ['ctrl', 'n'],
        open_file: ['ctrl', 'o'],
        new_window: ['ctrl', 'k'],
        open_directory: ['ctrl', 'p'],
        new_terminal: ['ctrl', 't'],
        hide_terminal: ['ctrl', 'l'],
        close_active_terminal: ['ctrl', 'y'],
        hide_explorer: ['ctrl', 'b'],
        redo: ['ctrl', 'shift', 'z'],
        undo: ['ctrl', 'z'],
        find: ['ctrl', 'd'],
        close: ['ctrl', 'e'],
    },
    reducers: {
        setSave: (state: any, action: PayloadAction<string[]>) => {
            state.save = action.payload;
        },
        setCopy: (state: any, action: PayloadAction<string[]>) => {
            state.copy = action.payload;
        },
        setPaste: (state: any, action: PayloadAction<string[]>) => {
            state.paste = action.payload;
        },
        setRedo: (state: any, action: PayloadAction<string[]>) => {
            state.redo = action.payload;
        },
        setUndo: (state: any, action: PayloadAction<string[]>) => {
            state.undo = action.payload;
        },
    },
});

const persistConfig = {
    key: 'shortcuts',
    storage,
};

export const shortcutsActions = shortcutsSlice.actions;
export default persistReducer(persistConfig, shortcutsSlice.reducer);
