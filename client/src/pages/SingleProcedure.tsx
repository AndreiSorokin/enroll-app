import { useParams } from 'react-router-dom';
import { RootState, useGetMastersByProcedureQuery } from '../redux';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  styled,
} from '@mui/material';
import { useSelector } from 'react-redux';
import BookingModal from '../components/BookingModal';
import { useState } from 'react';

const MasterCard = styled(Card)(({ theme }) => ({
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
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const FancyButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: '#fff',
  fontFamily: 'Playfair Display, serif',
  fontWeight: 500,
  padding: '8px 20px',
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

const SingleProcedure = () => {
  const { id } = useParams<{ id: string }>();
  const userData = useSelector((state: RootState) => state.user.userData);
  const { data, error, isLoading } = useGetMastersByProcedureQuery(id!);
  const [open, setOpen] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState<any>(null);
  const token = localStorage.getItem('token');

  const handleOpen = (master: any) => {
    setSelectedMaster(master);
    setOpen(true);
  };

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        Error fetching masters
      </Typography>
    );
  }

  if (isLoading || !data) {
    return (
      <Typography align="center" sx={{ mt: 4, fontStyle: 'italic' }}>
        Loading our expert stylists...
      </Typography>
    );
  }

  return (
    <Box sx={{ py: 6, backgroundColor: '#f9f6f2', minHeight: '100vh' }}>
      <HeaderTypography variant="h3" component="h1">
        Meet Our Masters
      </HeaderTypography>
      <BookingModal
        data={data}
        open={open}
        setOpen={setOpen}
        selectedMaster={selectedMaster}
        userData={userData}
        setSelectedMaster={setSelectedMaster}
        token={token}
      />
      <Grid container spacing={4} padding={{ xs: 2, md: 4 }}>
        {data.map((master) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={master.id}>
            <MasterCard elevation={0}>
              <CardContent sx={{ textAlign: 'center' }}>
                {master.image && (
                  <Box
                    component="img"
                    src={master.image}
                    alt={master.name}
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      mb: 2,
                      border: '3px solid #f06292',
                    }}
                  />
                )}
                <Typography
                  variant="h5"
                  component="div"
                  gutterBottom
                  sx={{
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 600,
                    color: '#8d5524',
                  }}
                >
                  {master.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: 'italic' }}
                >
                  Price: ${master.masterProcedures[0].price}
                </Typography>
              </CardContent>
              {userData && (
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <FancyButton
                    size="medium"
                    variant="contained"
                    onClick={() => handleOpen(master)}
                  >
                    Book Now
                  </FancyButton>
                </CardActions>
              )}
            </MasterCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SingleProcedure;