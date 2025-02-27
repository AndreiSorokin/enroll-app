import { Box, Button, Typography, Grid, Card, CardContent, CardActions, styled } from '@mui/material';
import { useGetAllUsersQuery, useUpdateUserStatusMutation } from '../redux';

const UserCard = styled(Card)(({ theme }) => ({
  background: '#fff',
  borderRadius: '15px',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
  },
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
}));

const FancyButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: '#fff',
  fontFamily: 'Playfair Display, serif',
  fontWeight: 500,
  padding: '8px 16px',
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

const HeaderTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Playfair Display, serif',
  fontWeight: 700,
  color: theme.palette.primary.main,
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

const Admin = () => {
  const { data, refetch, isLoading, error } = useGetAllUsersQuery();
  const [toggleUserStatus] = useUpdateUserStatusMutation();

  const handleToggleUserStatus = async (id: string, active: boolean) => {
    await toggleUserStatus({ id, active: !active });
    refetch();
  };

  if (isLoading) {
    return (
      <Typography align="center" sx={{ mt: 4, fontStyle: 'italic' }}>
        Loading users...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        Error fetching users
      </Typography>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Typography align="center" sx={{ mt: 4 }}>
        No users found
      </Typography>
    );
  }

  return (
    <Box sx={{ py: 6, backgroundColor: '#f9f6f2', minHeight: '100vh' }}>
      <HeaderTypography variant="h3" component="h1">
        Admin Dashboard
      </HeaderTypography>
      <Grid container spacing={4} padding={{ xs: 2, md: 4 }}>
        {data.map((user) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
            <UserCard elevation={0}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 600,
                    color: '#8d5524',
                  }}
                >
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Email: {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Role: {user.role}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <FancyButton
                  onClick={() => handleToggleUserStatus(user.id, user.active)}
                  variant="contained"
                >
                  {user.active ? 'Ban User' : 'Unban User'}
                </FancyButton>
              </CardActions>
            </UserCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Admin;