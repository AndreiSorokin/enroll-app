import { Box, Button, TextField } from '@mui/material';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { z } from 'zod';

import { useLoginMutation, useResetPasswordMutation } from '../redux';
import useInput from '../hooks/UseInput';

export const resetPasswordSchema = z.object({
   newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
         /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
         "Password must contain at least one letter and one number"
      ),
});

const ResetPassword = () => {
   const location = useLocation();
   const queryParams = new URLSearchParams(location.search);
   const token = queryParams.get('token');
   const [resetPassword] = useResetPasswordMutation();

   const handleResetPassword = async() => {
      try {
         await resetPassword({
            newPassword: values.newPassword,
            token
         }).unwrap();
         toast.success("New password has been set successfully")
      } catch (error) {
         toast.error("Password must contain letters and numbers and to be at least 6 characters long");
      }
   }

   const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useInput(
      resetPasswordSchema,
      { newPassword: '' },
      handleResetPassword
   );
   return (
      <Box>
         <ToastContainer/>
         <h1>Enter new password:</h1>
         <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
               margin="normal"
               required
               id="newPassword"
               label="New password"
               name="newPassword"
               type="password"
               value={values.newPassword}
               onChange={handleChange}
               onBlur={handleBlur}
               error={touched.newPassword && Boolean(errors.newPassword)}
               helperText={touched.newPassword && errors.newPassword}
            />
            <Button type="submit" variant="contained" color="primary">
               Reset Password
            </Button>
         </Box>
      </Box>
   )
}

export default ResetPassword
