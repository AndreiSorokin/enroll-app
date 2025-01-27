import { Route, Routes } from "react-router-dom";

import Procedures from "./pages/Procedures"
import NavBar from "./components/NavBar";
import SingleProcedure from "./pages/SingleProcedure";
import BookProcedure from "./pages/BookProcedure";

function App() {

  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path="/procedures" element={ <Procedures/> }/>
        <Route path="/procedures/:id" element={ <SingleProcedure/> }/>
        <Route path="/bookings" element={<BookProcedure/>}/>
      </Routes>
    </div>
  )
}

export default App
