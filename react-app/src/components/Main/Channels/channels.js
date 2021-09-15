import { useSelector } from 'react-redux';
import { NavLink, Switch, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import './channels.css';

const Channels = ({ channels }) => {
	return (
		<>
			<h1>Channel page</h1>
			{channels?.map((channel) => (
				<div key={channel.id}>
					<NavLink to={`/${channel.server_id}/${channel.id}`}>
						<h2>{channel.name}</h2>
					</NavLink>
				</div>
			))}
		</>
	);
};

export default Channels;
