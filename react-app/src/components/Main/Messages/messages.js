import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useParams } from 'react-router';

const Messages = ({ socket }) => {
	const { serverId, channelId } = useParams();

	const servers = useSelector((state) => state.session.servers);
	const user = useSelector((state) => state.session.user);

	const [server, setServer] = useState(
		servers.find((server) => server.id == serverId)
	);
	const [channel, setChannel] = useState(
		server.channels.find((channel) => channel.id == channelId)
	);
	const [messages, setMessages] = useState(channel.messages);
	const [message, setMessage] = useState('');

	const dateConverter = (dateStr) => {
		const msgDay = new Date(dateStr).getTime();
		const nowDay = new Date(Date.now()).getTime();
		// console.log(nowDay - msgDay);
		if (nowDay - msgDay < 86400000) {
			// console.log('MESSAGE TODAY');
		} else if (nowDay - msgDay < 86400000 * 2) {
			// console.log('MESSAGE YESTERDAY');
		}
	};

	useEffect(() => {
		socket.on('message', (message) => {
			// console.log(message);
			setMessages([...messages, message]);
		});

		return () => socket.off('message');
	}, [messages, messages.length, socket]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const newMessage = {
			message: message,
			user_id: user.id,
			channel_id: channelId,
			imageUrl: null,
		};
		const res = socket.emit('message', newMessage);
		console.log(res);
		setMessage('');
	};

	const updateMessage = (e) => {
		setMessage(e.target.value);
	};

	return (
		<>
			<ul class="messages">
				{messages &&
					messages.map((message) => (
						<li key={message.id}>
							<img
								alt="temp"
								src={
									server.users.find((user) => user.id == message.user_id)
										.profile_picture
								}
							/>
							<p>{dateConverter(message.createdAt)}</p>
							<div class="message-content">
								<p>{message.message}</p>
							</div>
						</li>
					))}
			</ul>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder={`Message ${channel.name}`}
					value={message}
					onChange={updateMessage}
				></input>
				<button type="submit">Send</button>
			</form>
		</>
	);
};

export default Messages;
