import { Box, Button, TextField, Container, CssBaseline, Typography, styled } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useResetPasswordMutation } from '../redux';
import useInput from '../hooks/UseInput';
import { resetPasswordSchema } from '../schemas/schemas';

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

const ResetPassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const [resetPassword] = useResetPasswordMutation();
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      await resetPassword({
        newPassword: values.newPassword,
        token: token!,
      }).unwrap();
      toast.success('New password has been set successfully');
      navigate('/auth/login');
    } catch {
      toast.error('Password must contain letters and numbers and be at least 6 characters long');
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useInput(
    resetPasswordSchema,
    { newPassword: '' },
    handleResetPassword
  );

  return (
    <BackgroundBox>
      <ToastContainer />
      <Container maxWidth="xs">
        <CssBaseline />
        <FormBox component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <HeaderTypography variant="h4" sx={{ mb: 3 }}>
            Enter New Password
          </HeaderTypography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="newPassword"
            label="New Password"
            name="newPassword"
            type="password"
            value={values.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.newPassword && Boolean(errors.newPassword)}
            helperText={touched.newPassword && typeof errors.newPassword === 'string' ? errors.newPassword : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '&:hover fieldset': { borderColor: '#f06292' },
                '&.Mui-focused fieldset': { borderColor: '#8d5524' },
              },
            }}
          />
          <FancyButton type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Reset Password
          </FancyButton>
        </FormBox>
      </Container>
    </BackgroundBox>
  );
};

export default ResetPassword;