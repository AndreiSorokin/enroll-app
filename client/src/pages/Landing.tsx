import { 
  Box, 
  Button, 
  Typography, 
  Container, 
  CssBaseline 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';


const HeroSection = styled(Box)({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: `url('https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: '#fff',
  textAlign: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
});

const HeroContent = styled(Box)({
  position: 'relative',
  zIndex: 2,
});

const Landing = () => {
  return (
    <Box>
      <CssBaseline />
      <HeroSection>
        <HeroContent>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              fontFamily: 'Playfair Display, serif',
              fontSize: { xs: '2.5rem', md: '4rem' },
            }}
          >
            Welcome to Luxe Beauty Salon
          </Typography>
          <Typography 
            variant="h5" 
            component="p" 
            gutterBottom 
            sx={{ 
              fontWeight: 300, 
              maxWidth: '600px', 
              mx: 'auto', 
              fontSize: { xs: '1.2rem', md: '1.5rem' },
            }}
          >
            Indulge in luxury and elevate your beauty with our expert stylists.
          </Typography>
          <Button 
            component={Link}
            to="/procedures"
            variant="contained" 
            color="secondary" 
            size="large" 
            href="#book" 
            sx={{ 
              mt: 4, 
              px: 4, 
              py: 1.5, 
              borderRadius: '50px',
              backgroundColor: '#f06292',
              '&:hover': { backgroundColor: '#ec407a' },
            }}
          >
            Book Now
          </Button>
        </HeroContent>
      </HeroSection>

      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Our Services
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary">
          Haircuts, styling, skincare, and more—crafted just for you.
        </Typography>
      </Container>
    </Box>
  );
};

export default Landing;