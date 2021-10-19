import './main.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { Redirect } from 'react-router-dom';


import './main.css';
import Friends from './Friends/friends';
import Servers from './Servers/servers';
import MenuModal from './Menu';

let endPoint = process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:5000/';

let socket = process.env.NODE_ENV === 'production' ? io() : io.connect(`${endPoint}`);

// let socket = io(); FOR DEPLOYMENT


function Main() {
	const user = useSelector((state) => state.session.user);


    const [selectedServer, setServer] = useState('');


	useEffect(() => {
		socket.emit('online', user.id);
	});

    useEffect(() => {
        if (!user) {
            Redirect('/about')
        }
    })


	return (
        <div className="main-container">
            <Servers socket={socket} selectedServer={selectedServer} setServer={setServer} />
            <Friends socket={socket} />
            <div className="user_profile_name">
                <div className='user-profile'>
                    <img
                        alt="profile"
                        src={user.profile_picture}
                        className="user_profile_photo"
                    />
                    <p>{user.username}</p>
                </div>
            </div>
            <MenuModal socket={socket} />
        </div>
	);
}

export default Main;
