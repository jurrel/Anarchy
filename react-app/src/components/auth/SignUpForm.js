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

	return (
		<form className="log-form" onSubmit={onSignUp}>
			<div>
				{errors.map((error, ind) => (
					<div key={ind}>{error}</div>
				))}
			</div>
			<label>User Name</label>
			<input
				type="text"
				name="username"
				onChange={updateUsername}
				value={username}
			></input>
			<label>Email</label>
			<input
				type="text"
				name="email"
				onChange={updateEmail}
				value={email}
			></input>
			<label>Password</label>
			<input
				type="password"
				name="password"
				onChange={updatePassword}
				value={password}
			></input>
			<label>Repeat Password</label>
			<input
				type="password"
				name="repeat_password"
				onChange={updateRepeatPassword}
				value={repeatPassword}
				required={true}
			></input>
			<label>Profile Picture</label>
			<input
				type="file"
				name="file"
				onChange={updateFile}
				required={false}
			></input>
			<button type="submit">Sign Up</button>
		</form>
	);
};

export default SignUpForm;
