import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/userSlice";
import { procedureApi } from "../api/procedureSlice";
import { bookingApi } from '../api/bookingSlice';
import { timeSlotApi } from '../api/timeSlotSlice';


const store = configureStore({
   reducer: {
      [userApi.reducerPath]: userApi.reducer,
      [procedureApi.reducerPath]: procedureApi.reducer,
      [bookingApi.reducerPath]: bookingApi.reducer,
      [timeSlotApi.reducerPath]: timeSlotApi.reducer,
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