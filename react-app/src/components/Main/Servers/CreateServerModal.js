import { Modal } from '../../context/Modal/Modal';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function CreateServerModal({ socket }) {
	const user = useSelector((state) => state.session.user);
	const servers = useSelector((state) => state.session.servers);
	const [showModal, setShowModal] = useState(false);
	const [name, setName] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [allServers, setAllServers] = useState(servers);
	const [joinServer, setJoinServer] = useState(servers)
	useEffect(() => {
		socket.on('new-server', (server) => {
			setAllServers([...allServers, server]);
		});
		return () => {
			socket.disconnect();
		};
	}, [allServers, socket]);

	useEffect(()=> {
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
			imageUrl,
		};
		socket.emit('new-server', data);
		setShowModal(false);
		return;
	};

	const handleCancel = async (e) => {
		e.preventDefault();
		setShowModal(false);
		return;
	};

	const updateServerName = (e) => setName(e.target.value);
	const updateServerImage = (e) => setImageUrl(e.target.value);


	return (
		<>
			<div onClick={() => setShowModal(true)}>
				<i
					className="fa fa-plus plus-icon plus-icon-container"
					onClick={() => setShowModal(true)}
					title="Create Channel"
				/>
			</div>
			{showModal && (
				<Modal onClose={() => setShowModal(false)}>
					<form
						autoComplete='off'
						className="create-channel-modal"
						onSubmit={(e) => handleCreateServer(e)}
					>
						<div className="channel-modal-title">Customize your Server</div>
						<div className="text-under-channel-modal">Give your server a personality! </div>
						<div className="text-under-channel-modal">If it sucks... you can always change it</div>

						<div className='form-divs'>
							<label className='create-server-name-input'>Server Name</label>
							<input
								type="text"
								placeholder="Server name"
								required
								autoComplete="off"
								onChange={(e) => updateServerName(e)}
							></input>
						</div>

						<div className='form-divs'>
							<label className='image-Url-input'>Image Url</label>
							<input className="channel_photo_upload_modal"
                            type="text"
                            placeholder="Image Url here.."
                            value={imageUrl}
							required 
                            onChange={updateServerImage} />
						</div>
						<div className='buttons'>
							<button className="cancel_button" type="button" onClick={handleCancel}>
								Cancel
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
