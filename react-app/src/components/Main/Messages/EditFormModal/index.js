import { useState } from 'react';
import { Modal } from '../../../context/Modal/Modal';
import EditForm from './EditForm';

function EditFormModal({ oldMessage, socket, messages, setMessages }) {
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<button
				onClick={() => setShowModal(true)}
				className="edit-message"
				id={`edit-${oldMessage.id}`}
			>
				<i className="fas fa-pencil-alt m2"></i>
				Edit
			</button>
			{showModal && (
				<Modal onClose={() => setShowModal(false)}>
					<EditForm
						oldMessage={oldMessage}
						socket={socket}
						showModal={showModal}
						setShowModal={setShowModal}
						messages={messages}
						setMessages={setMessages}
					/>
				</Modal>
			)}
		</>
	);
}

export default EditFormModal;
