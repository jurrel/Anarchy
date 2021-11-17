import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import Channels from '../Channels/channels';
import './servers.css';
import CreateServerModal from './CreateServerModal';
import SearchModal from '../../Search';
import HomeModal from '../../HomePage/homemodal';
import { authenticate } from '../../../store/session';
import User from '../../User';
import { Socket } from '../../context/socket';


function Servers() {
	const dispatch = useDispatch();
	const socket = Socket();

	const serverState = useSelector((state) => state.session.servers).sort(
		(a, b) => a.id - b.id
	);
	const user = useSelector(state => state.session.user);

	function collectChannels(servers) {
		const channels = [];
		servers.forEach(server => {
			channels.push(...server.channels)
		})
		return channels;
	}

	const [selectedServer, setServer] = useState('');
	const [servers, setServers] = useState(serverState);
	const [channels, setChannels] = useState(collectChannels(servers));
	const [unread, setUnread] = useState('');

	useEffect(() => {



		socket.on('unread-message', (message) => {
			const channel = channels.find(chan => chan.id === message.channel_id);
			channel.messages.push(message);
			if (message.user_id !== user.id) {
				setUnread(channel.server_id)
			}
		})

		return () => socket.off('unread-message')
	})

	// , [channels, selectedServer, servers, socket, unread, user.id]


	return (
        <div className="server-sidebar">
                <>
                    <div
                        className={
                            'server-icon home-icon-container ' +
                            (!selectedServer ? 'active' : '')
                        }
                        onClick={(e) => setServer('')}
                    >
                        <div className="home-icon">
                            <HomeModal servers={servers} />
                        </div>
                    </div>
					<div id='search' className='server-icon'>
						<div className='home-icon'>
							<SearchModal servers={servers} setServers={setServers} />
						</div>
					</div>
					<div
                        className="server-icon plus-icon-container" onClick={(e) => setServer('')}>
                        <div className='plus-icon'>
                            <CreateServerModal />
                        </div>
                    </div>
				</>
					{servers?.map((server) => (
						<div key={server.id}>
							<div className={unread === server.id ? "server-icon unread" : "server-icon"} onClick={(e) => setServer(server)}>
								<div
									className={selectedServer.id === server.id ? 'active' : ''}
								>
									<img
										src={server.imageUrl}
										alt=""
										className="server_img_container"
									/>
								</div>
							</div>
							<div className={selectedServer.id === server.id ? "channel_list" : 'hidden'}>
								{selectedServer && (
									<Channels
										server={selectedServer}
										channels={selectedServer.channels}
										unread={unread}
										setUnread={setUnread}
									/>
								)}
							</div>
						</div>
					))}
		</div>
	);
}

export default Servers;
