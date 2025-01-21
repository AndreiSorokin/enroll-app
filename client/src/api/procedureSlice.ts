import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Procedure } from "../misc/types";

export const procedureApi = createApi({
   reducerPath: "procedureApi",
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
      getAllProcedures: builder.query<Procedure[], void>({
         query: () => `/procedures`
      }),
      getSingleProcedure: builder.query<Procedure, string>({
         query: (id) => `/procedures/${id}`
      })
   })
});

export const {
   useGetAllProceduresQuery,
   useGetSingleProcedureQuery,
} = procedureApi;