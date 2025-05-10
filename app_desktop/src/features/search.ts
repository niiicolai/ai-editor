import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    visible: false,
  },
  reducers: {
    setSearchVisible: (state: any, action: PayloadAction<boolean>) => {
      state.visible = action.payload;
    },
  },
});

export const { setSearchVisible } = searchSlice.actions;
export default searchSlice.reducer;
