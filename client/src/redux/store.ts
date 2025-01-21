import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/userSlice";
import { procedureApi } from "../api/procedureSlice";

const store = configureStore({
   reducer: {
      [userApi.reducerPath]: userApi.reducer,
      [procedureApi.reducerPath]: procedureApi.reducer
   },
   middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware().concat(
         userApi.middleware,
         procedureApi.middleware,
      )
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;