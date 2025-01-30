import React from 'react'
import { useParams } from 'react-router-dom'
import { z } from 'zod';

import { useGetUserByIdQuery, useUpdateUserMutation } from '../redux';
import { Box, Button, TextField } from '@mui/material';
import defaultPicture from '../img/defaultPicture.png'
import { toast } from 'react-toastify';
import useInput from '../hooks/UseInput';

export const updateUserSchema = z.object({
   name: z.string().min(1, 'Invalid name'),
});


const Profile = () => {
   const { id } = useParams<{ id:string }>();
   const { data, refetch } = useGetUserByIdQuery(id!);
   const [updateUser] = useUpdateUserMutation();
   const token = localStorage.getItem("token");

   console.log(data)

   const handleUpdate = async() => {
      console.log("Update button clicked");
      try {
         await updateUser({
            id,
            name: values.name,
            token
         }).unwrap();
         toast.success("Name updated successfully!");
         refetch();
      } catch (error) {
         toast.error("Updating name failed!");
      }
   }

   const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useInput(
      updateUserSchema,
      { email: '', password: '', name: '', role: 'user', image: null},
      handleUpdate
   );

   return (
      <Box>
         {data?.active === false && 
            <h1>You account is inactive, please contact support</h1>
         }
         {data && data.active === true &&
            <Box>
               <h1>Hello, {data.name}!</h1>
               <img style={{ borderRadius: '5px', width: '150px' }} src={data.image || defaultPicture} alt="" />
               <h3>Here you can update your information</h3>
               <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                  <TextField
                     margin="normal"
                     required
                     fullWidth
                     id="name"
                     label="name"
                     name="name"
                     value={values.name}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     error={touched.name && Boolean(errors.name)}
                     helperText={touched.name && errors.name}
                  />
                  <Button
                     type="submit"
                     fullWidth
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
                     }}
                  >
                     Update name
                  </Button>
               </Box>
               <h3>Update password: </h3>
            </Box>
         }
      </Box>
   )
}

export default Profile
