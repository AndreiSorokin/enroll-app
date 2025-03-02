import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TimeSlot } from "../misc/types";

export const timeSlotApi= createApi({
   reducerPath: "timeSlotApi",
   baseQuery: fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL || '/api/v1/',
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
         query: ({ masterId, procedureId, date }) => ({
            url: `time-slots/available`,
            params: { masterId, procedureId, date }
         })
      }),
      createTimeSlots: builder.mutation<TimeSlot[], { masterId: string, procedureId: string, date: string, startTime: string, endTime: string, slotDuration: number }>({
         query: ({ masterId, procedureId, date, startTime, endTime, slotDuration }) => ({
            url: `time-slots/${masterId}/${procedureId}`,
            method: "POST",
            body: { date, startTime, endTime, slotDuration },
            params: { masterId, procedureId },
            headers: { 'Content-Type': 'application/json' }
         })
      }),
   })
})

export const {
   useGetAllTimeSlotsQuery,
   useGetAllAvailableTimeSlotsQuery,
   useCreateTimeSlotsMutation
} = timeSlotApi;