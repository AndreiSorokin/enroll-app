import { Avatar, Box, Button, Checkbox, Container, CssBaseline, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography, styled } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useRegistrationMutation } from '../redux';
import useInput from '../hooks/UseInput';
import { toast } from 'react-toastify';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// Registration Schema (unchanged)
export const registrationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must contain letters and numbers and be at least 6 characters long'),
});

// Styled Full-Width Background Box
const BackgroundBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#f9f6f2', // Soft beige
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(4),
  width: '100vw', // Full viewport width
}));

// Styled Form Box
const FormBox = styled(Box)(({ theme }) => ({
  background: '#fff',
  padding: theme.spacing(4),
  borderRadius: '15px',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)', // Soft shadow
}));

// Styled Typography for header
const HeaderTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Playfair Display, serif',
  fontWeight: 700,
  color: theme.palette.primary.main, // Warm brown
  textAlign: 'center',
}));

// Styled Button
const FancyButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main, // Soft pink
  color: '#fff',
  fontFamily: 'Playfair Display, serif',
  fontWeight: 500,
  padding: '10px 20px',
  borderRadius: '25px',
  border: `2px solid ${theme.palette.secondary.main}`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: '#fff',
    color: theme.palette.secondary.main,
    borderColor: theme.palette.secondary.main,
    transform: 'scale(1.05)', // Slight scale-up
  },
}));

// Styled Link
const FancyLink = styled(Link)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textDecoration: 'none',
  marginLeft: theme.spacing(1),
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const Registration = () => {
  const navigate = useNavigate();
  const [registration] = useRegistrationMutation();
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleSignUp = async () => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('role', values.role);

    if (avatar) {
      formData.append('image', avatar);
    }

    try {
      await registration(formData).unwrap();
      toast.success('Registration successful!');
      navigate('/procedures');
    } catch {
      toast.error('Registration failed!');
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useInput(
    registrationSchema,
    { email: '', password: '', name: '', role: 'user', image: null },
    handleSignUp
  );

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAvatar(event.target.files[0]);
    }
  };

  return (
    <BackgroundBox>
      <Container maxWidth="xs">
        <CssBaseline />
        <FormBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <PersonAddIcon />
          </Avatar>
          <HeaderTypography component="h1" variant="h4">
            Sign Up
          </HeaderTypography>
          <Box component="form" noValidate sx={{ mt: 3, width: '100%' }} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && typeof errors.name === 'string' ? errors.name : ''}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#f06292' }, // Pink on hover
                      '&.Mui-focused fieldset': { borderColor: '#8d5524' }, // Brown when focused
                    },
                  }}
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
                  helperText={touched.email && typeof errors.email === 'string' ? errors.email : ''}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#f06292' },
                      '&.Mui-focused fieldset': { borderColor: '#8d5524' },
                    },
                  }}
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
                  helperText={touched.password && typeof errors.password === 'string' ? errors.password : ''}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#f06292' },
                      '&.Mui-focused fieldset': { borderColor: '#8d5524' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="role-label" sx={{ '&.Mui-focused': { color: '#8d5524' } }}>
                    Role
                  </InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={values.role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.role && Boolean(errors.role)}
                    sx={{
                      borderRadius: '10px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ccc',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f06292',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#8d5524',
                      },
                    }}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="master">Master</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FancyButton variant="outlined" component="label" fullWidth>
                  Choose Avatar
                  <input
                    type="file"
                    hidden
                    onChange={handleAvatarChange}
                    accept="image/*"
                  />
                </FancyButton>
                {avatar && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                    Selected: {avatar.name}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions, and updates via email."
                  sx={{ color: 'text.secondary' }}
                />
              </Grid>
            </Grid>
            <FancyButton type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </FancyButton>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?
                <FancyLink to="/auth/login">Sign in</FancyLink>
              </Typography>
            </Box>
          </Box>
        </FormBox>
      </Container>
    </BackgroundBox>
  );
};

export default Registration;