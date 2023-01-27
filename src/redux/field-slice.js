import { createSlice } from "@reduxjs/toolkit";

const fieldSlice = createSlice({
  name: "fields",
  initialState: {
    fieldList: [],
  },
  reducers: {
    setFieldList(state, action) {
      state.fieldList = action.payload;
    },
  },
});

export const fieldActions = fieldSlice.actions;

export default fieldSlice;
