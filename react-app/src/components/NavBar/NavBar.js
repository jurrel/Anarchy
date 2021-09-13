import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import React from 'react';
import MenuModal from './Menu';
import './nav.css';

const NavBar = () => {

  const user = useSelector(state => state.session.user);

  return (
    <nav className='nav-bar'>
      { user && (
        <MenuModal />
      )}
      { !user && (
        <>
          <NavLink to='/' exact={true} activeClassName='active'>Home</NavLink>
          <NavLink to='/login' exact={true} activeClassName='active'>Login</NavLink>
          <NavLink to='/sign-up' exact={true} activeClassName='active'>Sign Up</NavLink>
        </>
      )}
    </nav>
  );
}

export default NavBar;
