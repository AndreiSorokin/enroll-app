import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Master, Procedure } from "../misc/types";

export const procedureApi = createApi({
   reducerPath: "procedureApi",
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
      getAllProcedures: builder.query<Procedure[], void>({
         query: () => `/procedures`
      }),
      getSingleProcedure: builder.query<Procedure, string>({
         query: (id) => `/procedures/${id}`
      }),
      getMastersByProcedure: builder.query<Master[], string>({
         query: (id) => `/procedures/${id}/masters`
      })
   })
});

export const {
   useGetAllProceduresQuery,
   useGetSingleProcedureQuery,
   useGetMastersByProcedureQuery
} = procedureApi;