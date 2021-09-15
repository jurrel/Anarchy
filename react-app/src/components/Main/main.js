import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { io } from 'socket.io-client';
import Peer from 'peerjs';

import './main.css';
import OnlineFriends from './OnlineFriends/onlineFriends';
import Friends from './OnlineFriends/friends';


let endPoint = 'http://127.0.0.1:5000/';

let socket = io.connect(`${endPoint}`);


const myPeer = new Peer(undefined, {
    host: 'localhost',
    port: 9000,
    path: '/myapp'
});


function Main() {
    
    const user = useSelector(state => state.session.user);
    const servers = useSelector(state => state.session.servers);
    const friends = useSelector(state => state.session.friends);
    
    const [serverId, setServerId] = useState('');
    const [channelId, setChannelId] = useState('');
    const [online, setOnline] = useState(false);
    
    const [message, setMessage] = useState('');
    const [sender, setSender] = useState(1);
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(false);
    
    const [members, setMembers] = useState(0);
    const [video, setVideo] = useState(true);
    const [audio, setAudio] = useState(true);
    
    useEffect(() => {

        if (online) return;
        socket.emit('online', user.id);
        setOnline(true);

    }, [online, user.id])

    return (
        <div className='main-container'>
            <h1>Main Page</h1>
            <Friends socket={socket} />
        </div>
    )
}

export default Main;