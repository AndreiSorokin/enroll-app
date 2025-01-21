import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
   return (
      <ul>
         <Link to="/">Home</Link>
         <Link to="/procedures">Procedures</Link>
         <Link to="/login">Log in</Link>
      </ul>
   )
}

export default NavBar
