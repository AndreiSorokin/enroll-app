import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TimeSlot } from "../misc/types";

export const timeSlotApi= createApi({
   reducerPath: "timeSlotApi",
   baseQuery: fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      prepareHeaders: (headers) => {
         const token = localStorage.getItem('token');
         if (token) {
            headers.set("Authorization", `Bearer ${token}`);
         }
      },
   }),
   endpoints: (builder) => ({
      getAllTimeSlots: builder.query<TimeSlot[], void>({
         query: () => `time-slots`
      }),
      getAllAvailableTimeSlots: builder.query<TimeSlot[], { masterId: string, procedureId: string, date: string }>({
         query: ({ masterId, procedureId, date }) => 
            `time-slots/available?masterId=${masterId}&procedureId=${procedureId}&date=${date}`
      })
   })
})

export const {
   useGetAllTimeSlotsQuery,
   useGetAllAvailableTimeSlotsQuery
} = timeSlotApi;