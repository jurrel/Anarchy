import { createContext, useContext, useEffect } from "react";
import { io } from 'socket.io-client';

let socket = io() 

export const SocketContext = createContext(null);
export const Socket = () => useContext(SocketContext);

function SocketProvider(props) {

    useEffect(() => {
		socket.on('disconnect', () => {
			socket.connect();
		})
	})
    
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}

export default SocketProvider;