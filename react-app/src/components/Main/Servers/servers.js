import { useSelector } from 'react-redux';
import { NavLink, Switch, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Channels from '../Channels/channels'
import './servers.css'

function Servers() {
    const servers = useSelector(state => state.session.servers);
    // console.log('THIS IS SERVERS FROM SERVERS', servers)
    const user = useSelector(state => state.session.user);
    // console.log("THIS IS USER", user)
    const channels = useSelector(state => state.session.channels);
    // console.log("THIS IS Channels FROM SERVERS[0]", servers[0].channels)


    return (
        <>
            <h1>Servers/Main page</h1>
            {servers?.map((server) => (
                <div key={server.id}>
                    <NavLink to={`/api/servers/${server.id}`}>
                        <img src={server.imageUrl} alt="" />
                    </NavLink>
                    <Switch>
                        <Route path={`/api/servers/${server.id}`}><Channels channels={server.channels}/></Route>
                    </Switch>
                </div>
            ))}
        </>
    )
}

export default Servers;