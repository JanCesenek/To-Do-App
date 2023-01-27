import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user-slice";
import fieldSlice from "./field-slice";
import itemSlice from "./item-slice";

const store = configureStore({
  reducer: { users: userSlice.reducer, fields: fieldSlice.reducer, items: itemSlice.reducer },
});

export default store;
