import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    userList: [],
    loggedIn: false,
    newUser: false,
  },
  reducers: {
    logIn(state, action) {
      state.loggedIn = true;
    },
    logOut(state, action) {
      state.loggedIn = false;
    },
    setUserList(state, action) {
      state.userList = action.payload;
    },
    toggleNewUser(state, action) {
      state.newUser = !state.newUser;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
