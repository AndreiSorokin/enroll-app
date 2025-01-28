import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/userApi";
import { procedureApi } from "../api/procedureApi";
import { bookingApi } from '../api/bookingApi';
import { timeSlotApi } from '../api/timeSlotApi';
import userReducer from "./userSlice";


const store = configureStore({
   reducer: {
      [userApi.reducerPath]: userApi.reducer,
      [procedureApi.reducerPath]: procedureApi.reducer,
      [bookingApi.reducerPath]: bookingApi.reducer,
      [timeSlotApi.reducerPath]: timeSlotApi.reducer,
      user: userReducer, 
   },
   middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware().concat(
         userApi.middleware,
         procedureApi.middleware,
         bookingApi.middleware,
         timeSlotApi.middleware,
      )
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;