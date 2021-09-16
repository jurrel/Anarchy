import { useSelector } from 'react-redux';
import { NavLink, Switch, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import './channels.css';
import VideoModal from '../../videoModal';

const Channels = ({ channels, serverId }) => {
	const user = useSelector((state) => state.session.user);

	console.log('THIS IS USER.usernamessssssss', user);
	return (
		<div className="channel_list">
			{/* <div className="server_name_header">
				<p>{server.name}</p>
			</div> */}
			{channels?.map((channel) => (
				<div className="align_the_side_bar_channel">
					<div
						key={channel.id}
						className={
							'channel ' +
							(channel.server_id === serverId ? 'visible' : 'hidden')
						}
					>
						<h2>{channel.name}</h2>
					</div>
				</div>
			))}
			<VideoModal serverId={serverId} />
			<div className="user_profile_name">
				<img src={user.profile_picture} className="user_profile_photo" />
				<p>{user.username}</p>
				<div className="settings_icon"></div>
			</div>
		</div>
	);
};

export default Channels;
