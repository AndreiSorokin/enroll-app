import { Box, Button, Typography, Grid, Card, CardContent, CardActions, styled } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDeleteBookingMutation, useDeleteUserProcedureMutation, useGetUserProcedureQuery } from '../redux';
import { toast, ToastContainer } from 'react-toastify';

const BackgroundBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#f9f6f2',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(4),
  width: '100vw',
}));

const ProcedureCard = styled(Card)(({ theme }) => ({
  background: '#fff',
  borderRadius: '15px',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
  },
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
}));

const UserProcedures = () => {
  const { id } = useParams<{ id: string }>();
  const { data, refetch, isLoading, error } = useGetUserProcedureQuery(id!);
  const [deleteUserProcedure] = useDeleteUserProcedureMutation();
  const [deleteBooking] = useDeleteBookingMutation();
  const token = localStorage.getItem('token');

  const handleDelete = async (userId: string, procedureId: string, masterId: string, id: string, timeSlotId: string) => {
    try {
      await deleteUserProcedure({ userId, procedureId, masterId, token: token! }).unwrap();
      await deleteBooking({ id, timeSlotId, token: token! }).unwrap();
      await refetch();
      toast.success('Enrollment cancelled successfully');
    } catch {
      toast.error('Error removing procedure');
    }
  };

  if (isLoading) {
    return <Typography align="center" sx={{ mt: 4, fontStyle: 'italic' }}>Loading enrollments...</Typography>;
  }

  if(!data) {
    return (
      <BackgroundBox>
        <Typography align="center" sx={{ mt: 4, fontFamily: 'Playfair Display, serif', color: '#8d5524' }}>
          No enrollments so far
        </Typography>
      </BackgroundBox>
    );
  }

  if (error) {
    return <Typography color="error" align="center" sx={{ mt: 4 }}>Error loading enrollments</Typography>;
  }

  if (!data || !token || data.length === 0) {
    return (
      <BackgroundBox>
        <Typography align="center" sx={{ mt: 4, fontFamily: 'Playfair Display, serif', color: '#8d5524' }}>
          You don’t have any enrollments yet.
        </Typography>
      </BackgroundBox>
    );
  }

  return (
    <BackgroundBox>
      <ToastContainer />
      <HeaderTypography variant="h3" sx={{ mb: 4 }}>
        Your Enrollments
      </HeaderTypography>
      <Grid container spacing={4} padding={{ xs: 2, md: 4 }}>
        {data.map((procedure) => (
          <Grid item xs={12} sm={6} md={4} key={procedure.id}>
            <ProcedureCard elevation={0}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: '#8d5524' }}>
                  {procedure.Procedure.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Duration: {procedure.Procedure.duration} {procedure.Procedure.duration > 1 ? 'hours' : 'hour'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Master: {procedure.Master.name}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <FancyButton
                  onClick={() => handleDelete(procedure.userId, procedure.procedureId, procedure.Master.id, procedure.Bookings[0].id, procedure.Bookings[0].timeSlotId)}
                >
                  Cancel
                </FancyButton>
              </CardActions>
            </ProcedureCard>
          </Grid>
        ))}
      </Grid>
    </BackgroundBox>
  );
};

export default UserProcedures;