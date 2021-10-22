import { useState } from 'react';
import { Socket } from '../../../context/socket';

function EditForm({ oldMessage, setShowModal, messages, setMessages }) {
	const socket = Socket();

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
					a.id - b.id
			)
		);

		socket.emit('edit-message', newMessage);
		setShowModal(false);
		return;
	};

	return (
		<form autoComplete='off' className="edit-form" onSubmit={handleSubmit}>
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
