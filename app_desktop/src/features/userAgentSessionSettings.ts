import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const userAgentSessionSettingsSlice = createSlice({
    name: "userAgentSessionSettings",
    initialState: {
        minimized: false,
        responsiveActive: false,
    },
    reducers: {
        setMinimized: (state: any, action: PayloadAction<boolean>) => {
            state.minimized = action.payload;
        },
        setResponsiveActive: (state: any, action: PayloadAction<boolean>) => {
            state.responsiveActive = action.payload;
        },
    },
});

const persistConfig = {
    key: 'userAgentSessionSettings', // key for storage
    storage,     // storage engine (localStorage in this case)
};

export const userAgentSessionSettingsActions = userAgentSessionSettingsSlice.actions;
export default persistReducer(persistConfig, userAgentSessionSettingsSlice.reducer);
