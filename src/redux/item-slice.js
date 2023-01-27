import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
  name: "items",
  initialState: {
    itemList: [],
    selected: "easy",
  },
  reducers: {
    setItemList(state, action) {
      state.itemList = action.payload;
    },
    setSelected(state, action) {
      state.selected = action.payload;
    },
  },
});

export const itemActions = itemSlice.actions;

export default itemSlice;
