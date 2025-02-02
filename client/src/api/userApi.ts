import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User, userProcedures } from "../misc/types";
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
      getUserProcedure: builder.query<userProcedures, string>({
         query: (id) => `users/${id}/user-procedures`
      }),
      addUserProcedure: builder.mutation<userProcedures, { userId: string, procedureId: string, masterId: string; token: string }>({
         query: ({ userId, procedureId, masterId, token }) => ({
            url: `users/${userId}/user-procedures/`,
            method: "POST",
            headers: {
               Authorization: `Bearer ${token}`,
               "Content-Type": "application/json",
            },
            
            body: { userId, procedureId, masterId }
         })
      }),
      resetPassword: builder.mutation<User, { newPassword: string; token: string }>({
         query: ({ newPassword, token }) => ({
            url: `users/reset-password?token=${token}`,
            method: 'POST',
            headers: {
               "Content-Type": "application/json",
            },
            body: { newPassword }
         })
      }),
      forgotPassword: builder.mutation<{ token: string }, { email: string }>({
         query: ({ email }) => ({
            url: `users/forgot-password`,
            method: 'POST',
            headers: {
               "Content-Type": "application/json",
            },
            body: { email }
         })
      }),
      updatePassword: builder.mutation<User, { id: string; currentPassword: string; newPassword: string; token: string }>({
         query: ({ id, currentPassword, newPassword, token }) => ({
            url: `users/${id}/update-password`,
            method: 'PUT',
            headers: {
               Authorization: `Bearer ${token}`,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ currentPassword, newPassword })
         })
      }),
      updateUser: builder.mutation<User, { id: string; name: string; token: string }>({
         query: ({ id, name, token }) => ({
            url: `users/${id}`,
            method: 'PUT',
            headers: {
               Authorization: `Bearer ${token}`,
            },
            body: { name },
         })
      }),
      login: builder.mutation<User, { email: string, password: string }>({
         query: (credentials) => ({
            url: 'users/login',
            method: 'POST',
            body: credentials
         }),
         onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
            try {
               const { data } = await queryFulfilled;
               
               localStorage.setItem('token', data.token!);

               const userData = parseJwt(data.token);
               dispatch(setUser(userData));
            } catch (error) {
               console.error('Login failed:', error);
            }
         }
      }),
      registration: builder.mutation<User, FormData>({
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
   useGetUserProcedureQuery,
   useLoginMutation,
   useRegistrationMutation,
   useUpdateUserMutation,
   useUpdatePasswordMutation,
   useForgotPasswordMutation,
   useResetPasswordMutation,
   useAddUserProcedureMutation
} = userApi;