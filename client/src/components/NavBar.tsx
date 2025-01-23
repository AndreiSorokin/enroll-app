import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

const Navbar = () => {
   const [openDrawer, setOpenDrawer] = useState(false);
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

   const handleDrawerToggle = () => {
      setOpenDrawer(!openDrawer);
   };

   return (
      <AppBar position="sticky">
         <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
               Enroll app
            </Typography>
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
                        <Button component={Link} to="/login" color="inherit" onClick={handleDrawerToggle}>
                           Log in
                        </Button>
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
                  <Button component={Link} to="/login" color="inherit">
                     Login
                  </Button>
               </ListItem>
            </List>
         )}
      </Toolbar>
      </AppBar>
   );
};

export default Navbar;
