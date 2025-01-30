import { useNavigate, Link } from "react-router-dom";
import { z } from 'zod';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import { Avatar, Box, Button, Container, CssBaseline, TextField, Typography } from '@mui/material';
import { useLoginMutation } from '../redux';
import useInput from '../hooks/UseInput';


export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must contain letters and numbers and to be at least 6 characters long'),
});

const Login = () => {
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  const handleLogin = async() => {
    try {
      const credentials = { email: values.email, password: values.password };
      await login(credentials).unwrap();
      toast.success('Login successful!');
      navigate("/procedures");
    } catch (error) {
      toast.error(error.message || 'Wrong email or password!');
    }
  }

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useInput(
    loginSchema,
    { email: '', password: '' },
    handleLogin
  );

  return (
    <Container component="main" maxWidth="xs">
      <ToastContainer/>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
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
            Sign In
          </Button>
        </Box>
      </Box>
      <Box>Don't have an account? 
        <Box component={Link} to="/auth/signup">Sign up</Box>
      </Box>
    </Container>
  );
}

export default Login
