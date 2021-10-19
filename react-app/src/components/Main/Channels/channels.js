import { useEffect, useState } from 'react';

import './channels.css';
import Messages from '../Messages/messages';

const Channels = ({ channels, server, socket, unread, setUnread }) => {
	const [selectedChannel, setSelectedChannel] = useState(1);

	useEffect(() => {
		if (!server) return;
		setSelectedChannel(server.channels[0].id);
	}, [server])
	
	return (
		<>
			<div className="server_name_header">
				<p id='server_name_tag'>{server.name}</p>
				<div className="server_name_bottom_bar"></div>
			</div>
			{channels?.map((channel) => (
				<div key={channel.id} className={channel.id === selectedChannel ? "align_the_side_bar_channel selected" : "align_the_side_bar_channel"}>
					<h2 onClick={(e) => setSelectedChannel(channel.id)}>
						{channel.name}
					</h2>
				</div>
			))}
			{selectedChannel && (
				<Messages
					socket={socket}
					channel={channels?.find(
						(channel) => channel.id === Number(selectedChannel)
					)}
					server={server}
					channels={channels}
					unread={unread}
					setUnread={setUnread}
				/>
			)}
		</>
	);
};

export default Channels;
