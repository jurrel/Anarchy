import { Modal } from '../../context/Modal/Modal';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function CreateServerModal({ socket }) {
	const user = useSelector((state) => state.session.user);
	const servers = useSelector((state) => state.session.servers);
	const [showModal, setShowModal] = useState(false);
	const [name, setName] = useState('');
	const [imageUrl, setImageUrl] = useState(null);
	const [allServers, setAllServers] = useState(servers);

	useEffect(() => {
		socket.on('new-server', (server) => {
			setAllServers([...allServers, server]);
		});
		return () => {
			socket.disconnect();
		};
	}, [allServers, socket]);

	const handleCreateServer = async (e) => {
		e.preventDefault();

		const data = {
			name,
			owner_id: user.id,
			file: imageUrl,
		};
		console.log(data);
		socket.emit('new-server', data);
		setShowModal(false);
		return;
	};

	const handleCancle = async (e) => {
		e.preventDefault();
		setShowModal(false);
		return;
	};

	const updateServerName = (e) => setName(e.target.value);
	const updateServerImage = (e) => setImageUrl(e.target.files[0]);

	return (
		<>
			<i
				className="fa fa-plus"
				onClick={() => setShowModal(true)}
				title="Create Channel"
			/>
			{showModal && (
				<Modal onClose={() => setShowModal(false)}>
					<form
						className="create-channel-modal"
						onSubmit={(e) => handleCreateServer(e)}
					>
						<input
							type="text"
							placeholder="Server name"
							onChange={(e) => updateServerName(e)}
						></input>
						<input type="file" onChange={(e) => updateServerImage(e)}></input>
						<div>
							<button type="submit">Create</button>
							<button type="button" onClick={handleCancle}>
								Cancle
							</button>
						</div>
					</form>
				</Modal>
			)}
		</>
	);
}

export default CreateServerModal;
