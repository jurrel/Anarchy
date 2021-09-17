import { useSelector } from 'react-redux';
import { NavLink, Switch, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Channels from '../Channels/channels';
import './servers.css';
import Friends from '../OnlineFriends/friends';

function Servers({ socket }) {
	const servers = useSelector((state) => state.session.servers);
	const user = useSelector((state) => state.session.user);

	const [selectedServer, setServer] = useState('');

	return (
		<div className="TEST">
			<div className="side_bar_main">
				<div className="align_the_side_bar">
					<>
						<div
							class={
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
							<>
								<div
									className="server-icon"
									key={server.id}
									onClick={(e) => setServer(server)}
								>
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
									{!selectedServer && <Friends socket={socket} />}
									<div className="user_profile_name">
										<img
											alt="profile"
											src={user.profile_picture}
											className="user_profile_photo"
										/>
										<p>{user.username}</p>
										<div className="settings_icon"></div>
									</div>
								</div>
							</>
						))}
					</>
				</div>
			</div>
		</div>
	);
}

export default Servers;

{
	/* <div className="server_img_name_container">
    <p> {server.name} </p>
</div> */
}
