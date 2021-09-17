import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useParams } from 'react-router';

import './messages.css';

const Messages = ({ socket, channel }) => {
	const [serverId, channelId] = [channel?.server_id, channel?.id];

	const servers = useSelector((state) => state.session.servers);
	const user = useSelector((state) => state.session.user);

	const [server, setServer] = useState(
		servers.find((server) => server.id == serverId)
	);
	const [messages, setMessages] = useState(channel ? channel.messages : []);
	const [message, setMessage] = useState('');

	const dateConverter = (dateStr) => {
		const marker = new Date(dateStr).toLocaleTimeString().split(' ')[1];
		console.log(marker);
		const timeStr = new Date(dateStr)
			.toLocaleTimeString()
			.split(':')
			.slice(0, 2)
			.join(':');
		const datedStr = new Date(dateStr).toLocaleDateString();
		const msgDay = new Date(dateStr).getTime();
		const nowDay = new Date(Date.now()).getTime();
		if (nowDay - msgDay < 86400000) {
			return `Today at ${timeStr} ${marker}`;
		} else if (nowDay - msgDay < 86400000 * 2) {
			return `Yesterday at ${timeStr} ${marker}`;
		} else {
			return datedStr;
		}
	};

	useEffect(() => {
		socket.on('message', (message) => {
			setMessages([...messages, message]);
		});

		return () => socket.off('message');
	}, [messages, messages.length, socket]);

	useEffect(() => {
		setMessages(channel ? channel.messages : []);
		const boxes = document.querySelectorAll('.messages-container');
		if (boxes) {
			for (let i = 0; i < boxes.length; i++) {
				boxes[i].scrollTo(0, boxes[i].scrollHeight);
			}
		}
	}, [channel]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const newMessage = {
			message: message,
			user_id: user.id,
			channel_id: channelId,
			imageUrl: null,
		};
		console.log(newMessage);
		socket.emit('message', newMessage);
		setMessage('');
	};

	const updateMessage = (e) => {
		setMessage(e.target.value);
	};

	return (
		<>
			<div class="channel-header">
				<h3 class="channel-header-text">{`${channel?.name}`}</h3>
			</div>
			<div class="messages-container">
				<ul class="messages">
					{messages &&
						messages.map((message) => (
							<>
								<li class="message" key={message.id}>
									<div class="message-info">
										<img
											class="message-user-profile-pic"
											alt="temp"
											src={
												server.users.find((user) => user.id == message.user_id)
													?.profile_picture
											}
										/>
										<h3>
											{
												server.users.find((user) => user.id == message.user_id)
													?.username
											}
										</h3>
										<p>{dateConverter(message.createdAt)}</p>
									</div>
									<div class="message-content">
										<p>{message.message}</p>
										<i class="fa-solid fa-ellipsis"></i>
									</div>
									<div class="edit-buttons">
										{Number(user.id) === Number(message.user_id) && (
											<>
												{/* <button class="del-message" id={message.id}>
													Delete Message
												</button>
												<button class="edit-message" id={message.id}>
													Edit Message
												</button> */}
											</>
										)}
									</div>
								</li>
							</>
						))}
				</ul>
			</div>
			<form class="message-box" onSubmit={handleSubmit}>
				<input
					id="message-box"
					type="text"
					placeholder={`Message #${channel?.name}`}
					value={message}
					onChange={updateMessage}
				></input>
				{/* <button type="submit">Send</button> */}
			</form>
		</>
	);
};

export default Messages;
