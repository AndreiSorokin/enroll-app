import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MasterProcedure, MasterProcedures, User, userProcedures } from "../misc/types";
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
      getAllUsers: builder.query<User[], void>({
         query: () => `users`
      }),
      deleteMasterProcedure: builder.mutation<void, { masterId: string, procedureId: string }>({
         query: ({ masterId, procedureId }) => ({
            url: `users/${masterId}/master-procedures`,
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
            }, 
            body: { procedureId }
         })
      }),
      addMasterProcedure: builder.mutation<MasterProcedure, { masterId: string, procedureName: string, price: number, duration: number }>({
         query: ({ masterId, procedureName, price, duration }) => ({
            url: `users/${masterId}/master-procedures`,
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: { procedureName, price, duration }
         })
      }),
      updateMasterProcedure: builder.mutation<MasterProcedure, { masterId: string, procedureId: string, price: number }>({
         query: ({ masterId, procedureId, price }) => ({
            url: `users/${masterId}/master-procedures/${procedureId}`,
            method: 'PUT',
            headers: {
               "Content-Type": "application/json",
            },
            body: { masterId, procedureId, price }
         })
      }),
      deleteUserProcedure: builder.mutation<void, { userId: string; procedureId: string; masterId: string; token: string }>({
         query: ({ userId, procedureId, masterId, token }) => ({
            url: `users/${userId}/user-procedures`,
            params: { procedureId, masterId },  
            method: "DELETE",
            headers: {
               Authorization: `Bearer ${token}`,
            },
         })
      }),
      getUserProcedure: builder.query<userProcedures, string>({
         query: (id) => `users/${id}/user-procedures`
      }),
      getAllMasterProcedures: builder.query<MasterProcedures, string>({
         query: (id) => `users/${id}/master-procedures`
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
      }),
      updateUserStatus: builder.mutation<User, { id: string, active: boolean }>({
         query: ({ id, active }) => ({
            url: `users/${id}/update-user-status`,
            method: 'POST',
            body: { active }
         })
      }),
      googleLogin: builder.mutation<{ token: string; refreshToken: string }, { googleToken: string }>({
         query: ({ googleToken }) => {
            console.log("Sending Google login request:", googleToken);
            return {
               url: `users/auth/google`,
               method: "POST",
               body: { id_token: googleToken },
               headers: {
                  "Content-Type": "application/json",
               },
            };
         },
         onQueryStarted: async (_, { queryFulfilled }) => {
            try {
               const { data } = await queryFulfilled;
               console.log("Google login successful:", data);
            } catch (error) {
               console.error("Google login failed:", error);
            }
         },
      }),

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
   useAddUserProcedureMutation,
   useDeleteUserProcedureMutation,
   useGetAllMasterProceduresQuery,
   useUpdateMasterProcedureMutation,
   useGetAllUsersQuery,
   useUpdateUserStatusMutation,
   useAddMasterProcedureMutation,
   useDeleteMasterProcedureMutation,
   useGoogleLoginMutation
} = userApi;