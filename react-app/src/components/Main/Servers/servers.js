import { useSelector } from 'react-redux';
import { useState } from 'react';
import Channels from '../Channels/channels';
import './servers.css';
import CreateServerModal from './CreateServerModal';
import SearchModal from '../../Search';
import Home from '../../HomePage/home';
import HomeModal from '../../HomePage/homemodal';


function Servers({ socket }) {

	const serverState = useSelector((state) => state.session.servers).sort(
		(a, b) => a.id - b.id
	);

	const [selectedServer, setServer] = useState('');
	const [servers, setServers] = useState(serverState);


	return ( 
        <div className="side_bar_main">
            <div className="align_the_side_bar">
                <>
                    <div
                        className={
                            'server-icon home-icon-container ' +
                            (!selectedServer ? 'active' : '')
                        }
                        onClick={(e) => setServer('')}
                    >
                        <div className="home-icon">
                            <HomeModal />
                        </div>
                    </div>
					<div id='search' className='server-icon'>
						<div className='home-icon'>
							<SearchModal servers={servers} setServers={setServers} socket={socket} />
						</div>
					</div>
					<div
                        className="server-icon plus-icon-container" onClick={(e) => setServer('')}>
                        <div className='plus-icon'>
                            <CreateServerModal socket={socket} />
                        </div>
                    </div>
						{servers?.map((server) => (
							<div key={server.id}>
								<div className="server-icon" onClick={(e) => setServer(server)}>
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
								<div className={selectedServer ? "channel_list" : 'hidden'}>
									{selectedServer && (
										<Channels
											server={selectedServer}
											channels={selectedServer.channels}
											socket={socket}
										/>
									)}
								</div>
							</div>
						))}
						
				</>
			</div>
		</div>
	);
}

export default Servers;

