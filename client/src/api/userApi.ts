import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginResponse, User, UserRegistrationData } from "../misc/types";
import parseJwt from "../helpers/decode";
import { setUser } from "../redux/userSlice";


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
      updateUser: builder.mutation<User, { id: string; email: string; token: string }>({
         query: ({ id, email, token }) => ({
            url: `users/${id}`,
            method: 'PUT',
            headers: {
               Authorization: `Bearer ${token}`,
            },
            body: { email, name },
         })
      }),
      login: builder.mutation<LoginResponse, { email: string, password: string }>({
         query: (credentials) => ({
            url: 'users/login',
            method: 'POST',
            body: credentials
         }),
         onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
            try {
               const { data } = await queryFulfilled;
               
               localStorage.setItem('token', data.token);

               const userData = parseJwt(data.token);
               dispatch(setUser(userData));
            } catch (error) {
               console.error('Login failed:', error);
            }
         }
      }),
      registration: builder.mutation<LoginResponse, FormData>({
         query: (user) => ({
            url: 'users/registration',
            method: 'POST',
            body: user,
            formData: true,
         }),
         onQueryStarted: async(_, { queryFulfilled, dispatch }) => {
            try {
               const { data } = await queryFulfilled;
               localStorage.setItem('token', data.token!);
               const userData = parseJwt(data.token);
               dispatch(setUser(userData));
            } catch (error) {
               console.error('Registration failed:', error);
            }
         }
      })
   })
});

export const {
   useGetUserByIdQuery,
   useLoginMutation,
   useRegistrationMutation,
   useUpdateUserMutation,
} = userApi;