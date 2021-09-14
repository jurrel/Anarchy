import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/session';
import './auth.css';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const onLogout = async (e) => {
    await dispatch(logout());
    history.push('/about')
  };

  return <button className='logout' onClick={onLogout}>Logout</button>;
};

export default LogoutButton;
