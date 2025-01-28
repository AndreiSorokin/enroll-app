import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Booking } from "../misc/types";

export const bookingApi = createApi({
   reducerPath: 'bookingApi',
   baseQuery: fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      prepareHeaders: (headers) => {
         const token = localStorage.getItem('token');
         if (token) {
            headers.set('Authorization', `Bearer ${token}`);
         }
      }
   }),
   endpoints: (builder) => ({
      createBooking: builder.query<Booking, void>({
         query: () => `/bookings`
      })
   })
})

export const {
   useCreateBookingQuery,
} = bookingApi;