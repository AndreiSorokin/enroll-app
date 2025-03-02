import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Booking } from "../misc/types";

export const bookingApi = createApi({
   reducerPath: 'bookingApi',
   baseQuery: fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL || '/api/v1/',
      prepareHeaders: (headers) => {
         const token = localStorage.getItem('token');
         if (token) {
            headers.set('Authorization', `Bearer ${token}`);
         }
      }
   }),
   endpoints: (builder) => ({
      createBooking: builder.mutation<Booking, { userId: string; timeSlotId: string, token: string }>({
         query: ({ userId, timeSlotId, token }) => ({
            url: "bookings",
            method: "POST",
            headers: {
               Authorization: `Bearer ${token}`,
               "Content-Type": "application/json",
            },
            body: { userId, timeSlotId }
         })
      }),
      deleteBooking: builder.mutation<void, { id: string; timeSlotId: string; token: string }>({
         query: ({ id, timeSlotId, token }) => ({
            url: `bookings/${id}`,
            params: { timeSlotId },
            method: "DELETE",
            headers: {
               Authorization: `Bearer ${token}`,
            },
         })
      })
   })
})

export const {
   useCreateBookingMutation,
   useDeleteBookingMutation
} = bookingApi;