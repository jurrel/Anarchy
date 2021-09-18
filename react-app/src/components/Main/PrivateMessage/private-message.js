import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import EditFormModal from '../Messages/EditFormModal';
import './privates.css';

function PrivateMessage({ friend, socket }) {

    const user = useSelector(state => state.session.user);


    const [messages, setMessages] = useState(friend && friend.messages ? friend.messages : '');
    const [message, setMessage] = useState('');

    const dateConverter = (dateStr) => {
		const marker = new Date(dateStr).toLocaleTimeString().split(' ')[1];
		// console.log(marker);
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

    const handleDelete = (e) => {
		e.preventDefault();
		const messageId = +e.target.id.split('-')[1];
		const newMessages = messages.filter((message) => message.id !== messageId);
		socket.emit('del-message', messageId);
		setMessages([...newMessages]);
	};

    const handleSubmit = (e) => {
		e.preventDefault();
		const newMessage = {
			message: message,
			user_id: user.id,
            receiver_id: friend.id,
			imageUrl: null,
		};
		socket.emit('private-message', newMessage);
		setMessage('');
	};

    return (
        <>
			<div id='messages-container' className="messages-container">
				<ul className="messages">
					{messages &&
						messages.map((message) => (
							<div key={message.id}>
								<li className="message" key={message.id}>
									<div className="message-info">
										<div className="image-container">
											<img
												className="message-user-profile-pic"
												alt="temp"
												src={friend.profile_picture}
											/>
										</div>
										<h3>{friend.username}</h3>
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
                                        {!messages.length && (<p>No messages yet!</p>)}
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
			<form id='messages-box' onSubmit={handleSubmit}>
				<input
					id="private-box"
					type="text"
					placeholder={`Message #${friend?.username}`}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				></input>
				{/* <button type="submit">Send</button> */}
			</form>
		</>
    )
}

export default PrivateMessage;