import { useState } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  IconButton,
  useMediaQuery,
  useTheme,
  styled,
  Box,
  ButtonProps,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { clearUser } from '../redux/userSlice';

const FancyAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
}));

interface NavButtonProps extends ButtonProps {
  to?: LinkProps['to'];
  component?: React.ElementType;
}

const NavButton = styled(Button)<NavButtonProps>(() => ({
  color: '#fff',
  fontFamily: 'Playfair Display, serif',
  fontWeight: 500,
  padding: '8px 16px',
  borderRadius: '25px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.05)',
  },
}));

const BrandTypography = styled(Typography)({
  fontFamily: 'Playfair Display, serif',
  fontWeight: 700,
  letterSpacing: '1px',
  color: '#fff',
});

const FancyDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    width: 250,
    padding: theme.spacing(2),
  },
}));

const Navbar = () => {
  const dispatch = useDispatch();
  const [openDrawer, setOpenDrawer] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const userData = useSelector((state: RootState) => state.user.userData);
  const id = userData?.id;
  const isActive = userData?.active === true;

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleLogout = () => {
    try {
      dispatch(clearUser());
      localStorage.removeItem('token');
    } catch (error) {
      console.error(error);
    }
  };

  const navItems = (
    <List sx={{ display: 'flex', padding: 0, margin: 0, ...(isMobile && { flexDirection: 'column' }) }}>
      <ListItem sx={{ margin: isMobile ? '0' : '0 10px' }}>
        <NavButton component={Link} to="/" onClick={isMobile ? handleDrawerToggle : undefined}>
          Home
        </NavButton>
      </ListItem>
      <ListItem sx={{ margin: isMobile ? '0' : '0 10px' }}>
        {userData?.role === 'master' && isActive ? (
          <NavButton component={Link} to={`/users/${id}/master-procedures`} onClick={isMobile ? handleDrawerToggle : undefined}>
            Procedures
          </NavButton>
        ) : (
          <NavButton component={Link} to="/procedures" onClick={isMobile ? handleDrawerToggle : undefined}>
            Procedures
          </NavButton>
        )}
      </ListItem>
      {userData && (
        <ListItem sx={{ margin: isMobile ? '0' : '0 10px' }}>
          <NavButton component={Link} to={`/users/${id}`} onClick={isMobile ? handleDrawerToggle : undefined}>
            Profile
          </NavButton>
        </ListItem>
      )}
      {(userData && (userData.role === 'user' || userData?.role === 'admin')) && (
        <ListItem sx={{ margin: isMobile ? '0' : '0 10px' }}>
          <NavButton component={Link} to={`/users/${id}/user-procedures`} onClick={isMobile ? handleDrawerToggle : undefined}>
            Enrollments
          </NavButton>
        </ListItem>
      )}
      {userData && userData.role === 'admin' && isActive && (
        <ListItem sx={{ margin: isMobile ? '0' : '0 10px' }}>
          <NavButton component={Link} to={`/users/admin`} onClick={isMobile ? handleDrawerToggle : undefined}>
            Admin
          </NavButton>
        </ListItem>
      )}
      <ListItem sx={{ margin: isMobile ? '0' : '0 10px' }}>
        {userData ? (
          <NavButton component={Link} to="/auth/login" onClick={handleLogout}>
            Logout
          </NavButton>
        ) : (
          <NavButton component={Link} to="/auth/login">
            Login
          </NavButton>
        )}
      </ListItem>
    </List>
  );

  return (
    <FancyAppBar position="sticky">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {userData ? (
          <BrandTypography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {userData.name}!
          </BrandTypography>
        ) : (
          <BrandTypography variant="h6" sx={{ flexGrow: 1 }}>
            Luxe Beauty Salon
          </BrandTypography>
        )}
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <FancyDrawer anchor="right" open={openDrawer} onClose={handleDrawerToggle}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <IconButton
                  color="inherit"
                  onClick={handleDrawerToggle}
                  sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' } }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              {navItems}
            </FancyDrawer>
          </>
        ) : (
          navItems
        )}
      </Toolbar>
    </FancyAppBar>
  );
};

export default Navbar;