import { useSelector } from 'react-redux';
import { NavLink, Switch, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Channels from '../Channels/channels';
import './servers.css';
import Friends from '../OnlineFriends/friends';
import MenuModal from '../Menu';
import CreateServerModal from './CreateServerModal';


function Servers({ socket }) {

	const servers = useSelector((state) => state.session.servers).sort(
		(a, b) => a.id - b.id
	);
	const user = useSelector((state) => state.session.user);

	const [selectedServer, setServer] = useState('');

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
                            <i className="fas fa-home fa-2x" />
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
								<div className="channel_list">
									{selectedServer && (
										<Channels
											server={selectedServer}
											channels={selectedServer.channels}
											socket={socket}
										/>
									)}
									{/* <div className="user_profile_name">
										<div className='user-profile'>
											<img
												alt="profile"
												src={user.profile_picture}
												className="user_profile_photo"
											/>
											<p>{user.username}</p>
										</div>
										<MenuModal />
									</div> */}
								</div>
							</div>
						))}
                    <div
                        className="server-icon plus-icon-container" onClick={(e) => setServer('')}>
                        <div className='plus-icon'>
                            <CreateServerModal socket={socket} />
                        </div>
                    </div>
					</>
			</div>
		</div>
	);
}

export default Servers;

