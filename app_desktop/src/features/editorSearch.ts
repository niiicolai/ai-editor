import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const editorSearchSlice = createSlice({
  name: "editorSearch",
  initialState: {
    visible: false,
  },
  reducers: {
    setSearchVisible: (state: any, action: PayloadAction<boolean>) => {
      state.visible = action.payload;
    },
  },
});

export const { setSearchVisible } = editorSearchSlice.actions;
export default editorSearchSlice.reducer;
