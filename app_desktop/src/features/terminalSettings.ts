import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const terminalSettingsSlice = createSlice({
    name: "terminalSettings",
    initialState: {
        minimized: false,
        disabled: false,
    },
    reducers: {
        setTerminalDisabled: (state: any, action: PayloadAction<boolean>) => {
            state.disabled = action.payload;
        },
        setTerminalMinimized: (state: any, action: PayloadAction<boolean>) => {
            state.minimized = action.payload;
        },
    },
});

const persistConfig = {
    key: 'terminalSettings', // key for storage
    storage,     // storage engine (localStorage in this case)
};

export const { setTerminalDisabled, setTerminalMinimized } = terminalSettingsSlice.actions;
export default persistReducer(persistConfig, terminalSettingsSlice.reducer);
