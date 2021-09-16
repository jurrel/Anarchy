import { useSelector } from 'react-redux';
import { NavLink, Switch, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import './channels.css';

const Channels = ({ channels }) => {
	
	const user = useSelector(state => state.session.user);
	console.log("THIS IS USER.usernamessssssss", user)
	return (
		<div className="channel_list">
			{/* <div className="server_name_header">
				<p>{server.name}</p>
			</div> */}
				<div className="align_the_side_bar">
						{channels?.map((channel) => (
							<div key={channel.id}>
								<NavLink to={`/${channel.server_id}/${channel.id}`}>
									<h2>{channel.name}</h2>
								</NavLink>
							</div>
						))}
				</div>
				<div className='user_profile_name'>
					<img src={user.profile_picture} className='user_profile_photo'/>
					<p>{user.username}</p>
				</div>	
		</div>	
	);
};

export default Channels;

{/* <div id="profile">
	<img className="profile-photo" src={this.props.currentUser.profilePhoto || window.logo} alt="profile-photo" />
	<div id="profile-name" onClick={this.copyName.bind(this)}>
		<p>{this.props.currentUser.username}</p>
		<p>#{this.props.currentUser.tag}</p>
	</div>
	<img id="cog" src={window.cog} alt="settings" />
	<p id="profile-name-copied">Copied!</p>
	<div className="arrow-down"></div>
</div> */}