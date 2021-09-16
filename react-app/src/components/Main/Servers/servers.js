import { useSelector } from 'react-redux';
import { NavLink, Switch, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Channels from '../Channels/channels'
import './servers.css'

function Servers() {
    const servers = useSelector(state => state.session.servers);
    // console.log('THIS IS SERVERS FROM SERVERS', servers)
    const user = useSelector(state => state.session.user);
    console.log("THIS IS USER.username", user.username)


    return (
        <div className='TEST'>
            <div className="side_bar_main">
                <div className='align_the_side_bar'>
                        {servers?.map((server) => (
                            <div key={server.id}>
                                <NavLink to={`/api/servers/${server.id}`}>
                                    <img src={server.imageUrl} alt="" className='server_img_container'/>
                                </NavLink>
                                <Switch>
                                    <Route path={`/api/servers/${server.id}`}>
                                        <div className="server_name_header">
                                            <Channels serverId={server.id} channels={server.channels}/>
                                        </div>
                                    </Route>
                                </Switch>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default Servers;

{/* <div className="server_img_name_container">
    <p> {server.name} </p>
</div> */}