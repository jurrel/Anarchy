import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Socket } from '../../context/socket';


import EditFormModal from '../Messages/EditFormModal';
import './privates.css';

function PrivateMessage({ friend, setShowModal, setUnread, messages, setMessages, message, setMessage }) {
	const socket = Socket();

    const user = useSelector(state => state.session.user);

	
	useEffect(() => {
		setUnread(false);
		const boxes = document.querySelectorAll('.messages-container');
		if (boxes) {
			for (let i = 0; i < boxes.length; i++) {
				boxes[i].scrollTo(0, boxes[i].scrollHeight);
			}
		}
	});

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
			id: uuidv4(),
			message: message,
			user_id: user.id,
            receiver_id: friend.id,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		setMessages([...messages, newMessage]);
		socket.emit('private-message', newMessage);
		setMessage('');
	};

    useEffect(() => {

        const closeModal = (e) => {
            if (!e.target.closest('#modal')) {
                setShowModal(false)
            }
        }
        document.addEventListener('click', closeModal)

        return () => document.removeEventListener('click', closeModal)
    }, [setShowModal])


     function whatToDisplay(message) {
        if (message.channel_id === null && message.user_id === user.id) {
            return (
                <div key={message.id}>
                    <div className='message-info private'>
						<div className='message-user'>
							<div className="image-container">
								<img className="message-user-profile-pic" alt="temp" src={user.profile_picture} />
							</div>
							<h3>{user.username}</h3>
							<i className="fas fa-ellipsis-h message-elipsis" id={`elipsis-${message.id}`} onClick={handleButtonClick}></i>
							<div className={`edit-buttons a${message.id}`}>
								<EditFormModal
									oldMessage={message}
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
							</div>
						</div>
                    </div>
                    <li className="message">
                        <div className="message-content private">
                        	<p>{dateConverter(message?.createdAt) + ' ' + editCheck(message)}</p>
                            <p>{message?.message}</p>
                        </div>
                    </li>
                </div>
            )
        } else if (message.channel_id === null && message.receiver_id === user.id) {
            return (
                <div key={message.id}>
                    <li className="message">
                        <div className='message-info'>
							<div className='message-user'>
								<div className="image-container">
									<img className="message-user-profile-pic" alt="temp" src={friend.profile_picture} />
								</div>
								<h3>{friend.username}</h3>
							</div>
                        </div>
                        <div className="message-content">
                            <p>{dateConverter(message?.createdAt) + ' ' + editCheck(message)}</p>
                            <p>{message?.message}</p>
                            {!messages.length && (<p>No messages yet!</p>)}
                        </div>
                    </li>
                </div>
            )
        }
    }

    return (
        <div id='private'>
			<div id='messages-container' className="messages-container">
				<ul className="messages">
                    {!messages.length && (<p>No messages yet!</p>)}
					{messages &&
						messages.map((message) => ( whatToDisplay(message, friend) ))}
				</ul>
			</div>
			<form autoComplete='off' id='messages-box' onSubmit={handleSubmit}>
				<input
					id="private-box"
					type="text"
					placeholder={`Message #${friend?.username}`}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				></input>
			</form>
		</div>
    )
}

export default PrivateMessage;
