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
	const [joinServer, setJoinServer] = useState(servers)
	console.log('what is servers', servers)
	useEffect(() => {
		socket.on('new-server', (server) => {
			setAllServers([...allServers, server]);
		});
		return () => {
			socket.disconnect();
		};
	}, [allServers, socket]);

	useEffect(()=> {
		// dont use join this si for the video chat
		socket.on('join', (serverJoin) => {
			setJoinServer([...joinServer, serverJoin]);
		});
		return () => {
			socket.off();
		};
	})

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
						<div className="channel-modal-title">Customize your Server</div>
						<div className="text-under-channel-modal">Give your new server a personality </div>
						<div className="text-under-channel-modal">If it sucks...you can always change it</div>
						
						<div className="server-name-header">
							<label className='create-server-name-input'>Server Name</label>
							<input
								type="text"
								placeholder="Server name"
								onChange={(e) => updateServerName(e)}
							></input>
						</div>
						<input className="channel_photo_upload_modal" type="file" onChange={(e) => updateServerImage(e)}></input>
						<div>
							<button className="cancle_button" type="button" onClick={handleCancle}>
								Cancle
							</button>
							<button className="create_button" type="submit">Create</button>
						</div>
					</form>
				</Modal>
			)}
		</>
	);
}

export default CreateServerModal;
