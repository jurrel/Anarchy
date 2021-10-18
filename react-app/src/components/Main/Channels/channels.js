import { useState } from 'react';

import './channels.css';
import Messages from '../Messages/messages';

const Channels = ({ channels, server, socket }) => {
	const [selectedChannel, setSelectedChannel] = useState(1);

	return (
		<>
			<div className="server_name_header">
				<p id='server_name_tag'>{server.name}</p>
				<div className="server_name_bottom_bar"></div>
			</div>
			{channels?.map((channel) => (
				<div key={channel.id} className="align_the_side_bar_channel">
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
				/>
			)}
		</>
	);
};

export default Channels;
