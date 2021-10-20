import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../../../store/session';

function EditProfile({ setEditProfile, socket }) {
	const dispatch = useDispatch();

	const user = useSelector((state) => state.session.user);

    const [errors, setErrors] = useState([]);
	const [username, setUsername] = useState(user.username);
	const [email, setEmail] = useState(user.email);
	const [password, setPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');
	const [file, setFile] = useState();


    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = await dispatch(signUp(username, email, password, file))
        if (data) {
				setErrors(data);
        } else {
            setEditProfile(false);
        }
    }

    return (
        <>
            <form autoComplete='off' id='edit-profile' onSubmit={handleSubmit}>
                <button id='close-settings' onClick={(e) => {
                    e.preventDefault();
                    setEditProfile(false)
                }}><i className="fas fa-times fa-2x"/></button>
                <div>
                    {errors.map((error, ind) => (
                        <div key={ind}>{error}</div>
                    ))}
                </div>
                <label>User Name</label>
                <input
                    type="text"
                    name="username"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                ></input>
                <label>Email</label>
                <input
                    type="text"
                    name="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                ></input>
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                ></input>
                { password && (
                    <>
                        <label>Repeat Password</label>
                        <input
                            type="password"
                            name="repeat_password"
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            value={repeatPassword}
                            required
                        ></input>
                    </>
                )}
                <label>Profile Picture</label>
                <input
                    type="file"
                    name="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    id='file-upload'
                ></input>
                <button type="submit">Save Changes</button>
            </form>
        </>
    )
}

export default EditProfile;
