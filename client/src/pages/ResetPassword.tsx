import { Box, Button, TextField } from '@mui/material';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { useResetPasswordMutation } from '../redux';
import useInput from '../hooks/UseInput';
import { resetPasswordSchema } from '../schemas/schemas';

const ResetPassword = () => {
   const location = useLocation();
   const queryParams = new URLSearchParams(location.search);
   const token = queryParams.get('token');
   const [resetPassword] = useResetPasswordMutation();
   const navigate = useNavigate();

   console.log(token);

   const handleResetPassword = async() => {
      try {
         await resetPassword({
            newPassword: values.newPassword,
            token
         }).unwrap();
         toast.success("New password has been set successfully");
         navigate('/auth/login');
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
