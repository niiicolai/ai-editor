import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TerminalType, TerminalMenuType } from '../types/terminalType';

export interface Terminal {
    terminals: TerminalType[];
    selectedIndex: number;
    inspectorMenu: TerminalMenuType | null;
}

const terminalsSlice = createSlice({
    name: "terminals",
    initialState: {
        terminals: [{ id: new Date().getTime().toString(), cwd: '/', messages: [] }],
        inspectorMenu: null,
        selectedIndex: 0,
    } as Terminal,
    reducers: {
        setTerminals: (state: any, action: PayloadAction<TerminalType[]>) => {
            state.terminals = action.payload;
        },
        setInspectorMenu: (state: any, action: PayloadAction<TerminalMenuType | null>) => {
            state.inspectorMenu = action.payload;
        },
        setSelectedIndex: (state: any, action: PayloadAction<number>) => {
            state.selectedIndex = action.payload;
        },
    },
});

export const { setTerminals, setInspectorMenu, setSelectedIndex } = terminalsSlice.actions;
export default terminalsSlice.reducer;
