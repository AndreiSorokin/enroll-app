import { Box, Button, TextField } from '@mui/material';
import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { z } from 'zod';

import { useForgotPasswordMutation } from '../redux';
import useInput from '../hooks/UseInput';

export const emailSchema = z.object({
   email: z.string().email('Invalid email address'),
});

const ForgotPassword = () => {
   const [forgotPassword] = useForgotPasswordMutation();


   const handleForgotPassword = async(email: string) => {
      try {
         const response = await forgotPassword(email).unwrap();
         toast.success(response.message);
      } catch (error) {
         toast.error('Unexpected error occured');
      }
   }

   const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useInput(
      emailSchema,
      { email: '' },
      handleForgotPassword
   );
   return (
      <Box>
         <ToastContainer/>
         <Box  component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
               margin="normal"
               required
               fullWidth
               name="email"
               label="email"
               id="email"
               value={values.email}
               onChange={handleChange}
               onBlur={handleBlur}
               error={touched.email && Boolean(errors.email)}
               helperText={touched.email && errors.email}
            />
            <Button 
            type="submit"
            variant="contained"
            sx={{
               color: '#E9E9E9',
               border: '2px solid #5F2E2E',
               fontSize: '15px',
               padding: { xs: '5px 10px', sm: '8px 15px' },
               backgroundColor: '#5F2E2E',
               '&:hover': {
                  borderColor: '#5F2E2E',
                  transition: '0.5s ease',
               },
            }}>Reset password</Button>
         </Box>
      </Box>
   )
}

export default ForgotPassword
