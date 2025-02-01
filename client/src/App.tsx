import { Route, Routes } from "react-router-dom";

import Procedures from "./pages/Procedures"
import NavBar from "./components/NavBar";
import SingleProcedure from "./pages/SingleProcedure";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import UserProcedures from "./pages/UserProcedures";

//TODO: User: enroll in procedure, ban users
//TODO: Procedures: add/remove procedure, add/remove master proccedure
//TODO: Other: tests, CI/CD
function App() {

  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path="/procedures" element={ <Procedures/> }/>
        <Route path="/procedures/:id" element={ <SingleProcedure/> }/>
        <Route path="/auth/login" element={<Login/>}/>
        <Route path="/auth/signup" element={<Registration/>}/>
        <Route path="/users/:id" element={<Profile/>}/>
        <Route path="/users/reset-password" element={<ResetPassword/>}/>
        <Route path="/users/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/users/:id/user-procedures" element={<UserProcedures/>}/>
      </Routes>
    </div>
  )
}

export default App
