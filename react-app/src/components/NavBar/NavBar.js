import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import React from 'react';
import './nav.css';
import Anarchy from '../auth/anarchy';

const NavBar = () => {

  const user = useSelector(state => state.session.user);

  return (
    <nav className='nav-bar'>
      { !user && (
        <>
          <Anarchy />
          <NavLink to='/about' exact={true} activeClassName='active'>About</NavLink>
        </>
      )}
    </nav>
  );
}

export default NavBar;
