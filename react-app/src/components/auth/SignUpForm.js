import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { signUp } from '../../store/session';

const SignUpForm = () => {
	const [errors, setErrors] = useState([]);
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');
	const [file, setFile] = useState(null);
	const user = useSelector((state) => state.session.user);
	const dispatch = useDispatch();

	const onSignUp = async (e) => {
		e.preventDefault();
		if (password === repeatPassword) {
			const data = await dispatch(signUp(username, email, password, file));
			if (data) {
				setErrors(data);
			}
		} else if (password !== repeatPassword) {
			setErrors(['password : Your passwords do not match.'])
		}
	};

	const updateUsername = (e) => {
		setUsername(e.target.value);
	};

	const updateEmail = (e) => {
		setEmail(e.target.value);
	};

	const updatePassword = (e) => {
		setPassword(e.target.value);
	};

	const updateRepeatPassword = (e) => {
		setRepeatPassword(e.target.value);
	};

	const updateFile = (e) => {
		setFile(e.target.files[0]);
	};

	if (user) {
    	return <Redirect to='/' />;
  	}

	return (
		<form autoComplete='off' className="log-form" onSubmit={onSignUp}>
			<label>User Name</label>
			<input
				type="text"
				name="username"
				required 
				onChange={updateUsername}
				value={username}
			></input>
			{errors.map((error, ind) => (
				<div className='error' key={ind}>{error.includes('username') ? error.split(':')[1] : ''}</div>
			))}
			<label>Email</label>
			<input
				type="email"
				required
				name="email"
				onChange={updateEmail}
				value={email}
			></input>
			{errors.map((error, ind) => (
				<div className='error' key={ind}>{error.includes('email') ? error.split(':')[1] : ''}</div>
			))}
			<label>Password</label>
			<input
				type="password"
				required
				name="password"
				onChange={updatePassword}
				value={password}
			></input>
			{errors.map((error, ind) => (
				<div className='error' key={ind}>{error.includes('password') ? error.split(':')[1] : ''}</div>
			))}
			<label>Repeat Password</label>
			<input
				type="password"
				name="repeat_password"
				required 
				onChange={updateRepeatPassword}
				value={repeatPassword}
			></input>
			{errors.map((error, ind) => (
				<div className='error' key={ind}>{error.includes('password') ? error.split(':')[1] : ''}</div>
			))}
			<label>Profile Picture</label>
			<input
				type="file"
				name="file"
				onChange={updateFile}
			></input>
			<button type="submit">Sign Up</button>
		</form>
	);
};

export default SignUpForm;
