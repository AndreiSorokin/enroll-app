import { useParams } from 'react-router-dom';
import { useGetUserByIdQuery, useUpdateUserMutation, useUpdatePasswordMutation } from '../redux';
import { Box, Button, TextField, Typography, styled, CssBaseline } from '@mui/material';
import defaultPicture from '../img/defaultPicture.png';
import { toast, ToastContainer } from 'react-toastify';
import useInput from '../hooks/UseInput';
import { updatePasswordSchema, updateUserSchema } from '../schemas/schemas';

const BackgroundBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#f9f6f2',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(4),
  width: '100vw',
}));

const ProfileBox = styled(Box)(({ theme }) => ({
  background: '#fff',
  padding: theme.spacing(4),
  borderRadius: '15px',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
  maxWidth: 500,
  width: '100%',
  margin: '0 auto',
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

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
}

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { data, refetch, isLoading, error } = useGetUserByIdQuery(id!);
  const [updateUser] = useUpdateUserMutation();
  const [updatePassword] = useUpdatePasswordMutation();
  const token = localStorage.getItem('token');

  const handleUpdate = async () => {
    try {
      await updateUser({
        id: id!,
        name: nameValues.name,
        token: token!,
      }).unwrap();
      toast.success('Name updated successfully!');
      refetch();
    } catch {
      toast.error('Updating name failed!');
    }
  };

  const { values: nameValues, errors: nameErrors, touched: nameTouched, handleChange: handleNameChange, handleBlur: handleNameBlur, handleSubmit: handleNameSubmit } = useInput(
    updateUserSchema,
    { name: '' },
    handleUpdate
  );

  const handlePasswordUpdate = async (values: PasswordFormValues) => {
    try {
      await updatePassword({
        id: id!,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        token: token!,
      }).unwrap();
      toast.success('Password updated successfully!');
      refetch();
    } catch {
      toast.error('Wrong password');
    }
  };

  const { values: passwordValues, errors: passwordErrors, touched: passwordTouched, handleChange: handlePasswordChange, handleBlur: handlePasswordBlur, handleSubmit: handlePasswordSubmit } = useInput<PasswordFormValues>(
    updatePasswordSchema,
    { currentPassword: '', newPassword: '' },
    handlePasswordUpdate
  );

  if (isLoading) {
    return <Typography align="center" sx={{ mt: 4, fontStyle: 'italic' }}>Loading profile...</Typography>;
  }

  if (error) {
    return <Typography color="error" align="center" sx={{ mt: 4 }}>Error loading profile</Typography>;
  }

  return (
    <BackgroundBox>
      <ToastContainer />
      <CssBaseline />
      <ProfileBox>
        {data?.active === false ? (
          <HeaderTypography variant="h4" sx={{ mb: 2 }}>
            Your account is inactive. Please contact support.
          </HeaderTypography>
        ) : (
          <>
            <HeaderTypography variant="h3" sx={{ mb: 2 }}>
              Hello, {data?.name}!
            </HeaderTypography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <img
                style={{ borderRadius: '50%', width: '150px', height: '150px', objectFit: 'cover', border: '3px solid #f06292' }}
                src={data?.image || defaultPicture}
                alt={data?.name}
              />
            </Box>
            <HeaderTypography variant="h5" sx={{ mb: 2 }}>
              Update Your Information
            </HeaderTypography>
            <Box component="form" onSubmit={handleNameSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                value={nameValues.name}
                onChange={handleNameChange}
                onBlur={handleNameBlur}
                error={nameTouched.name && Boolean(nameErrors.name)}
                helperText={nameTouched.name && typeof nameErrors.name === 'string' ? nameErrors.name : ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    '&:hover fieldset': { borderColor: '#f06292' },
                    '&.Mui-focused fieldset': { borderColor: '#8d5524' },
                  },
                }}
              />
              <FancyButton type="submit" fullWidth sx={{ mt: 2 }}>
                Update Name
              </FancyButton>
            </Box>
            <HeaderTypography variant="h5" sx={{ mt: 4, mb: 2 }}>
              Update Password
            </HeaderTypography>
            <Box component="form" onSubmit={handlePasswordSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="currentPassword"
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordValues.currentPassword}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                error={passwordTouched.currentPassword && Boolean(passwordErrors.currentPassword)}
                helperText={passwordTouched.currentPassword && typeof passwordErrors.currentPassword === 'string' ? passwordErrors.currentPassword : ''}
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
                id="newPassword"
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordValues.newPassword}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                error={passwordTouched.newPassword && Boolean(passwordErrors.newPassword)}
                helperText={passwordTouched.newPassword && typeof passwordErrors.newPassword === 'string' ? passwordErrors.newPassword : ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    '&:hover fieldset': { borderColor: '#f06292' },
                    '&.Mui-focused fieldset': { borderColor: '#8d5524' },
                  },
                }}
              />
              <FancyButton type="submit" fullWidth sx={{ mt: 2 }}>
                Update Password
              </FancyButton>
            </Box>
          </>
        )}
      </ProfileBox>
    </BackgroundBox>
  );
};

export default Profile;