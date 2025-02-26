import { Box, Button, TextField, Typography, Container, CssBaseline, styled } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { useForgotPasswordMutation } from '../redux';
import useInput from '../hooks/UseInput';
import { emailSchema } from '../schemas/schemas';

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

const ForgotPassword = () => {
  const [forgotPassword] = useForgotPasswordMutation();

  const handleForgotPassword = async (email: string) => {
   console.log(email)
    try {
      await forgotPassword({ email }).unwrap();
      toast.success('Password reset email sent successfully!');
    } catch {
      toast.error('Unexpected error occurred');
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useInput(
    emailSchema,
    { email: '' },
    handleForgotPassword
  );

  return (
    <BackgroundBox>
      <ToastContainer />
      <Container maxWidth="xs">
        <CssBaseline />
        <FormBox component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <HeaderTypography component="h1" variant="h4" sx={{ mb: 3 }}>
            Reset Your Password
          </HeaderTypography>
          <TextField
            margin="normal"
            required
            fullWidth
            name="email"
            label="Email Address"
            id="email"
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
          <FancyButton type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Reset Password
          </FancyButton>
        </FormBox>
      </Container>
    </BackgroundBox>
  );
};

export default ForgotPassword;