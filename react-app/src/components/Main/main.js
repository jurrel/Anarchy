import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { io } from 'socket.io-client';
import Peer from 'peerjs';


let endPoint = 'http://127.0.0.1:5000/';

let socket = io.connect(`${endPoint}`);

const myPeer = new Peer(undefined, {
      host: 'localhost',
      port: 9000,
      path: '/myapp'
});

function Main() {

    const [data, setData] = useState(false);
    const [serverId, setServerId] = useState(false);
    const [message, setMessage] = useState('');
    const [sender, setSender] = useState(1);
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(false);
    const [members, setMembers] = useState(0);
    const [stateStream, setStream] = useState();
    const [video, setVideo] = useState(true);
    const [audio, setAudio] = useState(true);

    return (
        <h1>Main Page</h1>
    )
}

export default Main;