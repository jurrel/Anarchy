import { useEffect, useState } from 'react';


function OnlineFriends({ socket }) {

    const [ onlineFriends, setOnlineFriends ] = useState([]);

    useEffect(() => {
        
        socket.on('online', (userId) => {
            console.log('ONLINE', userId)
        })

        return () => socket.off('online')
    }, [onlineFriends, onlineFriends.length, socket])

    return (
        <div className='online-friends'>
            <h1>Online Friends</h1>
        </div>
    )
}

export default OnlineFriends;