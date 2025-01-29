import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "../misc/types";
import parseJwt from "../helpers/decode";

const token = localStorage.getItem("token");
const initialState: UserState = {
   isLoggedIn: !!token,
   userData: token ? parseJwt(token) : null,
};

const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
      setUser(state, action: PayloadAction<UserState["userData"]>) {
         state.isLoggedIn = true;
         state.userData = action.payload;
      },
      clearUser(state) {
      state.isLoggedIn = false;
      state.userData = null;
      },
   },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
