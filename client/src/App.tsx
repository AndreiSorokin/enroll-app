import { Navigate, Route, Routes } from "react-router-dom";

import Procedures from "./pages/Procedures"
import NavBar from "./components/NavBar";
import SingleProcedure from "./pages/SingleProcedure";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import UserProcedures from "./pages/UserProcedures";
import MasterProcedures from "./pages/MasterProcedures";
import Admin from "./pages/Admin";
import parseJwt from "./helpers/decode";

//TODO: add/delete master procedure, Google login
//TODO: Other: tests, CI/CD
function App() {
  const userData = parseJwt(localStorage.getItem('token'));
  const isAdmin = userData?.role === 'admin';
  const isActive = userData?.active === true;

  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path="/procedures" element={ <Procedures/> }/>
        <Route path="/procedures/:id" element={ isActive ? <SingleProcedure/> : <Navigate to="/" replace/> }/>
        <Route path="/auth/login" element={<Login/>}/>
        <Route path="/auth/signup" element={<Registration/>}/>
        <Route path="/users/:id" element={ isActive ? <Profile/> : <Navigate to="/" replace/>}/>
        <Route path="/users/reset-password" element={ isActive ? <ResetPassword/> : <Navigate to="/" replace/>}/>
        <Route path="/users/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/users/:id/user-procedures" element={isActive ? <UserProcedures/> : <Navigate to="/" replace/>}/>
        <Route path="/users/:id/master-procedures" element={isActive ? <MasterProcedures/> : <Navigate to="/" replace/>}/>
        <Route path="/users/admin" element={ isAdmin ? <Admin/> : <Navigate to="/" replace/>}/>
        <Route path='*' element={<Navigate to='/' replace/>}/>
      </Routes>
    </div>
  )
}

export default App
