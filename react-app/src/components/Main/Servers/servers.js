import { useSelector } from 'react-redux';
import { NavLink, Switch, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Channels from '../Channels/channels';
import './servers.css';

function Servers() {
	const servers = useSelector((state) => state.session.servers);
	// console.log('THIS IS SERVERS FROM SERVERS', servers)
	const user = useSelector((state) => state.session.user);
	console.log('THIS IS USER.username', user.username);

	const [serverId, setServerId] = useState(1);

	return (
		<div className="TEST">
			<div className="side_bar_main">
				<div className="align_the_side_bar">
					{servers?.map((server) => (
						<div
							class="server-icon"
							key={server.id}
							onClick={(e) => setServerId(server.id)}
						>
							<div className={serverId === server.id ? 'active' : ''}>
								<img
									src={server.imageUrl}
									alt=""
									className="server_img_container"
								/>
							</div>
							<div className="server_name_header">
								<Channels serverId={serverId} channels={server.channels} />
							</div>
						</div>
					))}
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
