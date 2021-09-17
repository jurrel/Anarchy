import './main.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { io } from 'socket.io-client';
import Peer from 'peerjs';
import { BrowserRouter, Route, Switch } from 'react-router-dom';


import './main.css';
import OnlineFriends from './OnlineFriends/onlineFriends';
import Friends from './OnlineFriends/friends';
import Message from './Messages/messages';
import Servers from './Servers/servers';
import MenuModal from './Menu';

let endPoint = 'http://127.0.0.1:5000/';

let socket = io.connect(`${endPoint}`);

// const myPeer = new Peer(undefined, {
// 	host: 'localhost',
// 	port: 9000,
// 	path: '/myapp',
// });

function Main() {
	const user = useSelector((state) => state.session.user);
	const servers = useSelector((state) => state.session.servers);
	const friends = useSelector((state) => state.session.friends);

	const [serverId, setServerId] = useState('');
	const [channelId, setChannelId] = useState('');
	const [online, setOnline] = useState(false);

    const [ videoChat, setVideoChat ] = useState(true);
    const [selectedServer, setServer] = useState('');


	useEffect(() => {
		if (online) return;
		socket.emit('online', user.id);
		setOnline(true);
	}, [online, user.id]);

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
            <MenuModal />
		</div>
	);
}

export default Main;
