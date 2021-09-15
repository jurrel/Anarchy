import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './servers.css'

function Servers() {
    const servers = useSelector(state => state.session.servers);
    console.log('THIS IS SERVERS', servers)
    const user = useSelector(state => state.session.user);
    console.log("THIS IS USER", user)
    // console.log(servers.imageUrl) //There is no imageUrl for server
    const friends = useSelector(state => state.session.friends);
    console.log('THIS IS FRIENDS',friends)
    // console.log('UUUUUHHHHH', servers[channel])
    // const [userServer, setUserServer] = useState(servers.filter(server => server.channel === true && friend.isFriend === true));
    console.log(servers.channels)
    return (
        <>
            <h1>Servers/Main page</h1>
            {servers?.map((server) => (
                <div key={server.id}>
                    <NavLink to="/api/servers/id">
                        {/* <h3>{server.channels}</h3> */}
                        <img src={server.imageUrl} alt="" />
                    </NavLink>
                </div>
            ))}
        </>
    )
}

export default Servers;