import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EditFormModal from './EditFormModal';
import { v4 as uuidv4 } from 'uuid';

import './messages.css';

const Messages = ({ socket, channel, server, channels, unread, setUnread }) => {
	const dispatch = useDispatch();

	const [serverId, channelId] = [channel?.server_id, channel?.id];
	
	const user = useSelector((state) => state.session.user);
	
	const [messages, setMessages] = useState(
		channel ? channel.messages.sort((a, b) => a.id - b.id) : []);
		
	const [message, setMessage] = useState('');

	const dateConverter = (dateStr) => {
		const marker = new Date(dateStr).toLocaleTimeString().split(' ')[1];
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

	const editCheck = (message) => {
		if (
			new Date(message.createdAt).getTime() !==
			new Date(message.updatedAt).getTime()
		) {
			return '(edited)';
		}
		return '';
	};

	// useEffect(() => {
	// 	return () => setUnread(false);
	// })
	
	// useEffect(() => {
	// 	socket.on('message', (message) => {
	// 		console.log('message')
	// 		if (message.channel_id === channel.id) {
	// 			setMessages([...messages, message]);
	// 		} 
	// 	});

	// 	return () => socket.off('message');
	// }, [channel?.id, channels, dispatch, messages, messages.length, socket, user.id]);

	useEffect(() => {
		setMessages(channel ? channel.messages : []);
		const boxes = document.querySelectorAll('.messages-container');
		if (boxes) {
			for (let i = 0; i < boxes.length; i++) {
				boxes[i].scrollTo(0, boxes[i].scrollHeight);
			}
		}
	}, [channel, channelId, serverId, setUnread, unread]);
	
	useEffect(() => {
		if (unread === channel?.id) {
			setUnread(false)
		}
		const boxes = document.querySelectorAll('.messages-container');
		if (boxes) {
			for (let i = 0; i < boxes.length; i++) {
				boxes[i].scrollTo(0, boxes[i].scrollHeight);
			}
		}
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		const newMessage = {
			id: uuidv4(),
			message: message,
			user_id: user.id,
			channel_id: channelId,
			imageUrl: null,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		setMessages([...messages, newMessage])
		socket.emit('message', newMessage);
		setMessage('');
	};

	const handleDelete = (e) => {
		e.preventDefault();
		const messageId = +e.target.id.split('-')[1];
		const newMessages = messages.filter((message) => message.id !== messageId);
		socket.emit('del-message', messageId);
		setMessages([...newMessages]);
	};

	const handleButtonClick = (e) => {
		e.preventDefault();
		const messageId = e.target.id.split('-')[1];
		const buttons = document.querySelector(`.a${messageId}`);
		if (buttons) {
			if (buttons && buttons.style.display === 'inline') {
				buttons.style.display = 'none';
			} else {
				buttons.style.display = 'inline';
			}
		}
	};

	const updateMessage = (e) => {
		setMessage(e.target.value);
	};

	return (
		<>
			{ channel && (
				<div className="channel-header">
					<h3 className="channel-header-text">{`${channel.name}`}</h3>
				</div>
			)}
			<div className="messages-container">
				<ul className="messages">
					{messages &&
						messages.map((message) => (
							<div key={message.id}>
								<li className="message">
									<div className="message-info">
										<div className="image-container">
											<img
												className="message-user-profile-pic"
												alt="temp"
												src={
													server?.users.find(
														(user) => user.id === message.user_id
													)?.profile_picture
												}
											/>
										</div>
										<h3>
											{
												server?.users.find((user) => user.id === message.user_id)
													?.username
											}
										</h3>
										<p>
											{dateConverter(message?.createdAt) +
												' ' +
												editCheck(message)}
										</p>
										{user.id === message.user_id && (
											<i
												className="fas fa-ellipsis-h message-elipsis"
												id={`elipsis-${message.id}`}
												onClick={handleButtonClick}
											></i>
										)}
									</div>
									<div className="message-content">
										<p>{message?.message}</p>
									</div>
									<div className={`edit-buttons a${message.id}`}>
										{Number(user?.id) === Number(message?.user_id) && (
											<>
												<EditFormModal
													oldMessage={message}
													socket={socket}
													messages={messages}
													setMessages={setMessages}
												/>
												<button
													className="del-message"
													onClick={handleDelete}
													id={`del-${message.id}`}
												>
													<i className="fas fa-trash-alt m2"></i>
													Delete
												</button>
											</>
										)}
									</div>
								</li>
							</div>
						))}
				</ul>
			</div>
			<form autoComplete='off' className="messages-box" onSubmit={handleSubmit}>
				<input
					id="message-box"
					type="text"
					placeholder={`Message #${channel?.name}`}
					value={message}
					onChange={updateMessage}
				></input>
			</form>
		</>
	);
};

export default Messages;
