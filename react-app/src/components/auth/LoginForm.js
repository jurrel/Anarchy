import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../../store/session';

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <form className='log-form' onSubmit={onLogin}>
        {/* {errors.map((error, ind) => (
          <div key={ind}>{error}</div>
        ))} */}
        <label htmlFor='email'>Email</label>
        <input
          name='email'
          type='email'
          required
          placeholder='Email'
          value={email}
          onChange={updateEmail}
        />
        {errors.map((error, ind) => (
          <div className='error' key={ind}>{error.includes('email') ? error.split(':')[1] : ''}</div>
        ))}
        <label htmlFor='password'>Password</label>
        <input
          name='password'
          type='password'
          required
          placeholder='Password'
          value={password}
          onChange={updatePassword}
        />
        {errors.map((error, ind) => (
          <div className='error' key={ind}>{error.includes('password') ? error.split(':')[1] : ''}</div>
        ))}
        <button type='submit'>Submit</button>
    </form>
  );
};

export default LoginForm;
