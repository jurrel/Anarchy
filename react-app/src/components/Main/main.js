import './main.css';
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
		<div class="main-content">
			<div class="motto">
				<h1 class="motto-big">IMAGINE A PLACE...</h1>
				<br />
				<div class="motto-small">
					...where you can belong to a school club, a gaming group, or a
					worldwide art community. Where just you and a handful of friends can
					spend time together. A place that makes it easy to talk every day and
					hang out more often.
				</div>
			</div>
		</div>
	);


}

export default Main;
