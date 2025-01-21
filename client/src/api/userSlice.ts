import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../misc/types";


export const userApi = createApi({
   reducerPath: "userApi",
   baseQuery: fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      prepareHeaders: (headers) => {
         const token = localStorage.getItem('token');
         if (token) {
            headers.set("Authorization", `Bearer ${token}`);
         }
         return headers;
      }
   }),
   endpoints: (builder) => ({
      getUserById: builder.query<User, string>({
         query: (id) => `users/${id}`
      }),
   })
});

export const {
   useGetUserByIdQuery,
} = userApi;