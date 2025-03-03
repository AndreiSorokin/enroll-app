import { Link, LinkProps } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Box,
  styled,
  ButtonProps,
} from '@mui/material';
import { useGetAllProceduresQuery } from '../redux/index';
import { Procedure } from '../misc/types';

const FancyCard = styled(Card)(() => ({
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
  justifyContent: 'space-between',
  height: '100%',
}));

interface FancyButtonProps extends ButtonProps {
  to?: LinkProps['to'];
  component?: React.ElementType;
}

const FancyButton = styled(Button)<FancyButtonProps>(({ theme }) => ({
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

const Procedures = () => {
  const { data, error, isLoading } = useGetAllProceduresQuery();

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        No procedures listed
      </Typography>
    );
  }

  if (isLoading || !data) {
    return (
      <Typography align="center" sx={{ mt: 4, fontStyle: 'italic' }}>
        Loading luxurious treatments...
      </Typography>
    );
  }

  return (
    <Box sx={{ py: 6, backgroundColor: '#f9f6f2', minHeight: '100vh' }}>
      <HeaderTypography variant="h3">
        Our Signature Procedures
      </HeaderTypography>
      <Grid container spacing={4} padding={{ xs: 2, md: 4 }}>
        {data.map((procedure: Procedure) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={procedure.id}>
            <FancyCard elevation={0}>
              <CardContent sx={{ textAlign: 'center' }}>
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
                  {procedure.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: 'italic' }}
                >
                  Duration: {procedure.duration} hour{procedure.duration > 1 ? 's' : ''}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <FancyButton
                  size="medium"
                  component={Link}
                  to={`/procedures/${procedure.id}`}
                  variant="contained"
                >
                  View Details
                </FancyButton>
              </CardActions>
            </FancyCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Procedures;