import { useState } from 'react';
import * as sessionActions from '../../../../store/session';
import { useDispatch } from 'react-redux';

function EditForm({ oldMessage, socket, setShowModal, messages, setMessages }) {
	const dispatch = useDispatch();
	const [message, setMessage] = useState(oldMessage.message);

	const handleSubmit = (e) => {
		e.preventDefault();

		const newMessage = {
			id: oldMessage.id,
			message,
			user_id: oldMessage.user_id,
			receiver_id: oldMessage.receiver_id,
			channel_id: oldMessage.channel_id,
			isRead: oldMessage.isRead,
			createdAt: oldMessage.createdAt,
			updatedAt: Date.now(),
		};

		const prevMessage = messages.find(
			(message) => message.id === oldMessage.id
		);

		const newMessages = messages.filter(
			(message) => message.id !== oldMessage.id
		);

		prevMessage.message = newMessage.message;

		setMessages(
			[...newMessages, prevMessage].sort(
				(a, b) =>
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
			)
		);

		socket.emit('edit-message', newMessage);
		setShowModal(false);
		return;
	};

	return (
		<form className="edit-form" onSubmit={handleSubmit}>
			<label>
				Message
				<input
					type="text"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					required
				/>
			</label>
			<button type="submit">Save</button>
		</form>
	);
}

export default EditForm;
