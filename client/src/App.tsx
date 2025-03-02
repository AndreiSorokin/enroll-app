import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './redux/store';

import Procedures from './pages/Procedures';
import NavBar from './components/NavBar';
import SingleProcedure from './pages/SingleProcedure';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import UserProcedures from './pages/UserProcedures';
import MasterProcedures from './pages/MasterProcedures';
import Admin from './pages/Admin';
import Landing from './pages/Landing';

const theme = createTheme({
  palette: {
    primary: { main: '#8d5524' },
    secondary: { main: '#f06292' },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const AnimatedPage = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ x: '100vw', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100vw', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 0.5 }}
      style={{ position: 'absolute', width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  const { userData } = useSelector((state: RootState) => state.user);
  const isAdmin = userData?.role === 'admin';
  const isActive = userData?.active === true;

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <NavBar />
        <Box sx={{ position: 'relative', minHeight: 'calc(100vh - 64px)' }}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  <AnimatedPage>
                    <Landing />
                  </AnimatedPage>
                }
              />
              <Route
                path="/procedures"
                element={
                  <AnimatedPage>
                    <Procedures />
                  </AnimatedPage>
                }
              />
              <Route
                path="/procedures/:id"
                element={
                  <AnimatedPage>
                    <SingleProcedure />
                  </AnimatedPage>
                }
              />
              <Route
                path="/auth/login"
                element={
                  <AnimatedPage>
                    <Login />
                  </AnimatedPage>
                }
              />
              <Route
                path="/auth/signup"
                element={
                  <AnimatedPage>
                    <Registration />
                  </AnimatedPage>
                }
              />
              <Route
                path="/users/:id"
                element={
                  <AnimatedPage>
                    {isActive ? <Profile /> : <Navigate to="/" replace />}
                  </AnimatedPage>
                }
              />
              <Route
                path="/users/reset-password"
                element={
                  <AnimatedPage>
                    {<ResetPassword />}
                  </AnimatedPage>
                }
              />
              <Route
                path="/users/forgot-password"
                element={
                  <AnimatedPage>
                    <ForgotPassword />
                  </AnimatedPage>
                }
              />
              <Route
                path="/users/:id/user-procedures"
                element={
                  <AnimatedPage>
                    {isActive ? <UserProcedures /> : <Navigate to="/" replace />}
                  </AnimatedPage>
                }
              />
              <Route
                path="/users/:id/master-procedures"
                element={
                  <AnimatedPage>
                    {isActive ? <MasterProcedures /> : <Navigate to="/" replace />}
                  </AnimatedPage>
                }
              />
              <Route
                path="/users/admin"
                element={
                  <AnimatedPage>
                    {isAdmin ? <Admin /> : <Navigate to="/" replace />}
                  </AnimatedPage>
                }
              />
              <Route
                path="*"
                element={
                  <AnimatedPage>
                    <Navigate to="/" replace />
                  </AnimatedPage>
                }
              />
            </Routes>
          </AnimatePresence>
        </Box>
      </ThemeProvider>
    </Provider>
  );
}

export default App;