import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../redux/store";
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import parseJwt from '../helpers/decode';
import { clearUser } from "../redux/userSlice";

const Navbar = () => {
   const dispatch = useDispatch();
   const [openDrawer, setOpenDrawer] = useState(false);
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

   const userData = useSelector((state: RootState) => state.user.userData);
   console.log(userData)

      // const userData = parseJwt(localStorage.getItem('token'));
   
   const handleDrawerToggle = () => {
      setOpenDrawer(!openDrawer);
   };

   const handleLogout = () => {    
      try {
         dispatch(clearUser());
         localStorage.removeItem("token");
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <AppBar position="sticky">
         <Toolbar>
            {userData
            ? (
               <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Welcome, {userData.name}!
               </Typography>
            )
         : (
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
               Enroll app
            </Typography>
         )}
            {isMobile ? (
               <>
               <IconButton
                  color="inherit"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ display: { sm: 'none' } }}
               >
                  <MenuIcon />
               </IconButton>

               <Drawer anchor="right" open={openDrawer} onClose={handleDrawerToggle}>
                  <List sx={{ width: 250 }}>
                     <ListItem button>
                        <Button component={Link} to="/" color="inherit" onClick={handleDrawerToggle}>
                           Home
                        </Button>
                     </ListItem>
                     <ListItem button>
                        <Button component={Link} to="/procedures" color="inherit" onClick={handleDrawerToggle}>
                           Procedures
                        </Button>
                     </ListItem>
                     <ListItem button>
                     {userData
                  ? (
                     <Button component={Link} to="/auth/login" color="inherit" onClick={handleLogout}>
                        Log out
                     </Button>
                  )
                  : (
                     <Button component={Link} to="/auth/login" color="inherit">
                        Login
                     </Button>
                  )
                  }
                     </ListItem>
                  </List>
               </Drawer>
            </>
         ) : (
            <List sx={{ display: 'flex', padding: 0, margin: 0 }}>
               <ListItem sx={{ margin: '0 10px' }}>
                  <Button component={Link} to="/" color="inherit">
                     Home
                  </Button>
               </ListItem>
               <ListItem sx={{ margin: '0 10px' }}>
                  <Button component={Link} to="/procedures" color="inherit">
                     Procedures
                  </Button>
               </ListItem>
               <ListItem sx={{ margin: '0 10px' }}>
                  {userData
                  ? (
                     <Button component={Link} to="/auth/login" color="inherit">
                        Logout
                     </Button>
                  )
                  : (
                     <Button component={Link} to="/auth/login" color="inherit">
                        Login
                     </Button>
                  )
                  }
               </ListItem>
            </List>
         )}
      </Toolbar>
      </AppBar>
   );
};

export default Navbar;
