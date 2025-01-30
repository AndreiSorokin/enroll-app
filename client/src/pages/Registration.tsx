import { Avatar, Box, Button, Checkbox, Container, CssBaseline, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import { z } from 'zod';

import { useRegistrationMutation } from '../redux';
import useInput from '../hooks/UseInput';
import { toast } from 'react-toastify';

export const registrationSchema = z.object({
   name: z.string().min(1, 'Name is required'),
   email: z.string().email('Invalid email address'),
   password: z.string().min(6, 'Password must contain letters and numbers and to be at least 6 characters long'),
});

const Registration = () => {
   const navigate = useNavigate();
   const [registration] = useRegistrationMutation();
   const [avatar, setAvatar] = useState<File | null>(null)

   const handleSignUp = async() => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("role", values.role);

      if (avatar) {
         formData.append("image", avatar);
      }

      try {
         await registration(formData).unwrap(); 
         toast.success("Registration successful!");
         navigate('/procedures');
      } catch (error) {
         toast.error("Registration failed!");
      }
   }

   const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useInput(
      registrationSchema,
      { email: '', password: '', name: '', role: 'user', image: null},
      handleSignUp
   );

   const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
         setAvatar(event.target.files[0]);
      }
   };

   return (
      <Box>
         <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
               sx={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
               }}
            >
            <Avatar src={values.image ? URL.createObjectURL(values.image) : ''} sx={{ m: 1, bgcolor: 'secondary.main' }} />
            <Typography component="h1" variant="h5">
               Sign up
            </Typography>
            <Box component="form" noValidate  sx={{ mt: 3 }} onSubmit={handleSubmit}>
               <Grid container spacing={2}>
                  <Grid item xs={12}>
                     <TextField
                        autoComplete="name"
                        name="name"
                        required
                        fullWidth
                        id="name"
                        label="name"
                        autoFocus
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                     />
                  </Grid>
                  <Grid item xs={12}>
                  <TextField
                     required
                     fullWidth
                     id="email"
                     label="Email Address"
                     name="email"
                     autoComplete="email"
                     value={values.email}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     error={touched.email && Boolean(errors.email)}
                     helperText={touched.email && errors.email}
                  />
                  </Grid>
                  <Grid item xs={12}>
                  <TextField
                     required
                     fullWidth
                     name="password"
                     label="Password"
                     type="password"
                     id="password"
                     autoComplete="new-password"
                     value={values.password}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     error={touched.password && Boolean(errors.password)}
                     helperText={touched.password && errors.password}
                  />
                  </Grid>
                  <Grid item xs={12}>
                     <FormControl fullWidth>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                           labelId="role-label"
                           id="role"
                           name="role"
                           value={values.role}
                           onChange={handleChange}
                           onBlur={handleBlur}
                           error={touched.role && Boolean(errors.role)}
                        >
                           <MenuItem value="user">User</MenuItem>
                           <MenuItem value="master">Master</MenuItem>
                        </Select>
                     </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                  <Box sx={{ margin: "2vh" }}>
                  <Button
                     variant="outlined"
                     component="label"
                     sx={{
                        fontSize: { xs: '0.8rem', sm: '1rem' }, 
                        padding: { xs: '5px 10px', sm: '8px 15px' },
                        backgroundColor: 'transparent',
                     }}
                  >
                     Choose avatar
                     <input
                        type="file"
                        hidden
                        onChange={handleAvatarChange}
                        accept="image/*"
                        multiple
                     />
                  </Button>
                  </Box>
                  </Grid>
                  <Grid item xs={12}>
                  <FormControlLabel
                     control={<Checkbox value="allowExtraEmails" color="primary" />}
                     label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                  </Grid>
               </Grid>
               <Button
                  type="submit"
                  fullWidth
                  sx={{ 
                  color: '#E9E9E9', border: '2px solid #5F2E2E', 
                  fontSize: '15px', 
                  padding: { xs: '5px 10px', sm: '8px 15px', marginTop: '2vh',
                  '@media (max-width: 768px)': {
                     maxWidth: '90%',
                  },
                  },
                  backgroundColor: '#5F2E2E',
                  '&:hover': {
                     borderColor: '#5F2E2E',
                     transition: '0.5s ease'
                  }
                  }}
               >
                  Sign Up
               </Button>
               <Box>Already have an account? 
                  <Box component={Link} to="/auth/login">Sign in</Box>
               </Box>
            </Box>
            </Box>
         </Container>
      </Box>
   );
}

export default Registration
