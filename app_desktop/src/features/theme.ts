import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

interface Theme {
    name: string;
}

const themeSlice = createSlice({
    name: "theme",
    initialState: {
        name: "Default",
    } as Theme,
    reducers: {
        setTheme: (state: any, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
    },
});

const persistConfig = {
    key: 'theme', // key for storage
    storage,     // storage engine (localStorage in this case)
};

export const { setTheme } = themeSlice.actions;
export default persistReducer(persistConfig, themeSlice.reducer);
