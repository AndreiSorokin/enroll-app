import { Route, Routes } from "react-router-dom";

import Procedures from "./pages/Procedures"
import NavBar from "./components/NavBar";
import SingleProcedure from "./pages/SingleProcedure";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Profile from "./pages/Profile";

//TODO: User: reset password, forgot password, enroll in procedure, ban users
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
      </Routes>
    </div>
  )
}

export default App
