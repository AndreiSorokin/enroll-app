import { useNavigate, Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useGoogleLoginMutation, useLoginMutation } from '../redux';
import useInput from '../hooks/UseInput';
import { loginSchema } from '../schemas/schemas';

const BackgroundBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#f9f6f2',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(4),
  width: '100vw',
}));

const FormBox = styled(Box)(({ theme }) => ({
  background: '#fff',
  padding: theme.spacing(4),
  borderRadius: '15px',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Playfair Display, serif',
  fontWeight: 700,
  color: theme.palette.primary.main,
  textAlign: 'center',
}));

const FancyButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
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
    transform: 'scale(1.05)',
  },
}));

const FancyLink = styled(Link)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textDecoration: 'none',
  marginLeft: theme.spacing(1),
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const Login = () => {
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();

  const handleLogin = async () => {
    try {
      const credentials = { email: values.email, password: values.password };
      await login(credentials).unwrap();
      toast.success('Login successful!');
      navigate('/procedures');
    } catch {
      toast.error('Wrong email or password!');
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useInput(
    loginSchema,
    { email: '', password: '' },
    handleLogin
  );

  const handleGoogleLogin = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      toast.error('Google Login Failed!');
      return;
    }

    try {
      await googleLogin({ googleToken: credentialResponse.credential }).unwrap();
      toast.success('Google Login Successful!');
      navigate('/procedures');
    } catch {
      toast.error('Google Login Failed!');
    }
  };

  return (
    <BackgroundBox>
      <ToastContainer />
      <CssBaseline />
      <Container maxWidth="xs">
        <FormBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <HeaderTypography variant="h4">
            Sign In
          </HeaderTypography>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID}>
            <Box sx={{ mt: 2 }}>
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error('Google Login Failed!')}
                useOneTap
              />
            </Box>
          </GoogleOAuthProvider>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%' }}>
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
              helperText={touched.email && typeof errors.email === 'string' ? errors.email : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '&:hover fieldset': { borderColor: '#f06292' },
                  '&.Mui-focused fieldset': { borderColor: '#8d5524' },
                },
              }}
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
              helperText={touched.password && typeof errors.password === 'string' ? errors.password : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '&:hover fieldset': { borderColor: '#f06292' },
                  '&.Mui-focused fieldset': { borderColor: '#8d5524' },
                },
              }}
            />
            <FancyButton type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </FancyButton>
          </Box>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Don’t have an account?
              <FancyLink to="/auth/signup">Sign up</FancyLink>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <FancyLink to="/users/forgot-password">Forgot password?</FancyLink>
            </Typography>
          </Box>
        </FormBox>
      </Container>
    </BackgroundBox>
  );
};

export default Login;