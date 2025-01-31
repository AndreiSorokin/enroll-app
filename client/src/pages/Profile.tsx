import { useParams } from 'react-router-dom'

import { useGetUserByIdQuery, useUpdateUserMutation, useUpdatePasswordMutation } from '../redux';
import { Box, Button, TextField } from '@mui/material';
import defaultPicture from '../img/defaultPicture.png'
import { toast, ToastContainer } from 'react-toastify';
import useInput from '../hooks/UseInput';
import { updatePasswordSchema, updateUserSchema } from '../schemas/schemas';


const Profile = () => {
   const { id } = useParams<{ id:string }>();
   const { data, refetch } = useGetUserByIdQuery(id!);
   const [updateUser] = useUpdateUserMutation();
   const [updatePassword] = useUpdatePasswordMutation();
   const token = localStorage.getItem("token");

   const handleUpdate = async() => {
      try {
         await updateUser({
            id: id!,
            name: nameValues.name,
            token: token!
         }).unwrap();
         toast.success("Name updated successfully!");
         refetch();
      } catch {
         toast.error("Updating name failed!");
      }
   }

   const { 
      values: nameValues, 
      errors: nameErrors, 
      touched: nameTouched, 
      handleChange: handleNameChange, 
      handleBlur: handleNameBlur, 
      handleSubmit: handleNameSubmit 
   } = useInput(
      updateUserSchema,
      { name: '' },
      handleUpdate
   );

   const handlePasswordUpdate = async() => {
      try {
         await updatePassword({
            id: id!,
            currentPassword: passwordValues.currentPassword,
            newPassword: passwordValues.newPassword,
            token: token!
         }).unwrap();
         toast.success("Password updated successfully!");
         refetch();
      } catch {
         toast.error("Wrong password");
      }
   }

   const { 
      values: passwordValues, 
      errors: passwordErrors, 
      touched: passwordTouched, 
      handleChange: handlePasswordChange, 
      handleBlur: handlePasswordBlur, 
      handleSubmit: handlePasswordSubmit 
   } = useInput(
      updatePasswordSchema,
      { currentPassword: '', newPassword: '' },
      handlePasswordUpdate
   );

   return (
      <Box>
         <ToastContainer/>
         {data?.active === false && 
            <h1>You account is inactive, please contact support</h1>
         }
         {data && data.active === true &&
            <Box>
               <h1>Hello, {data.name}!</h1>
               <img style={{ borderRadius: '5px', width: '150px' }} src={data.image || defaultPicture} alt="" />
               <h3>Here you can update your information</h3>
               <Box component="form" onSubmit={handleNameSubmit} noValidate sx={{ mt: 1 }}>
                  <TextField
                     margin="normal"
                     required
                     fullWidth
                     id="name"
                     label="name"
                     name="name"
                     value={nameValues.name}
                     onChange={handleNameChange}
                     onBlur={handleNameBlur}
                     error={nameTouched.name && Boolean(nameErrors.name)}
                     helperText={nameTouched.name && typeof nameErrors.name === 'string' ? nameErrors.name : ''}
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
               <Box component="form" onSubmit={handlePasswordSubmit} noValidate sx={{ mt: 1 }}>
               <TextField
                     margin="normal"
                     required
                     fullWidth
                     id="currentPassword"
                     label="Current password"
                     name="currentPassword"
                     type="password"
                     value={passwordValues.currentPassword}
                     onChange={handlePasswordChange}
                     onBlur={handlePasswordBlur}
                     error={passwordTouched.currentPassword && Boolean(passwordErrors.currentPassword)}
                     helperText={passwordTouched.currentPassword && typeof passwordErrors.currentPassword === 'string' ? passwordErrors.currentPassword : ''}
                  />
                  <TextField
                     margin="normal"
                     required
                     fullWidth
                     id="newPassword"
                     label="New password"
                     name="newPassword"
                     type="password"
                     value={passwordValues.newPassword}
                     onChange={handlePasswordChange}
                     onBlur={handlePasswordBlur}
                     error={passwordTouched.newPassword && Boolean(passwordErrors.newPassword)}
                     helperText={passwordTouched.newPassword && typeof passwordErrors.newPassword === 'string' ? passwordErrors.newPassword : ''}
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
                     Update password
                  </Button>
               </Box>
            </Box>
         }
      </Box>
   )
}

export default Profile
