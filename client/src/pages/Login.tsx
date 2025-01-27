import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import { Avatar, Box, Button, Container, CssBaseline, Grid, TextField, Typography } from '@mui/material';
import { useLoginMutation } from '../redux/index';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault();

    try {
      const credentials = { email, password };
      await login(credentials).unwrap();

      navigate("/procedures");
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  return (
      <div>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <Button type="submit" fullWidth variant="contained"
              sx={{ 
                color: '#E9E9E9', border: '2px solid #5F2E2E', 
                fontSize: '15px', 
                padding: { xs: '5px 10px', sm: '8px 15px',
                '@media (max-width: 768px)': {
                  maxWidth: '90%',
                },
                },
                backgroundColor: '#5F2E2E',
                '&:hover': {
                  borderColor: '#5F2E2E',
                  transition: '0.5s ease'
                }
              }}
              >
                Sign In
              </Button>
              {/* <Button onClick={() => setOpenForgotPassword(true)} sx={{color: "#E9E9E9", textDecoration: "underline"}}>
                Forgot Password?
              </Button> */}
                {/* <Dialog open={openForgotPassword} onClose={() => setOpenForgotPassword(false)}>
                <DialogTitle>Forgot Password</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="forgotEmail"
                    label="Email Address"
                    type="email"
                    fullWidth
                    value={forgotEmailInput.value}
                    onChange={forgotEmailInput.onChange}
                  />
                </DialogContent>
                <DialogActions sx={{backgroundColor: theme === 'bright' ? '#9C9C9C' : '#353535'}}>
                  <Button onClick={() => setOpenForgotPassword(false)} sx={{color: theme === 'bright' ? 'black' : '#E9E9E9'}}>
                    Cancel
                  </Button>
                  <Button onClick={handleForgotPassword}
                  >
                    Send Email
                  </Button>
                </DialogActions>
              </Dialog> */}
              <Grid container>
                <Grid item>
                  <Link to="/auth/signup" style={{color: "#E9E9E9", textDecoration: "underline", fontSize: '18px'}}>Don't have an account? Sign Up</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </div>
    );
}

export default Login
