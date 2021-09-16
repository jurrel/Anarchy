import { Route, Switch, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import OnlineFriends from './onlineFriends';
import PendingFriends from './pending-friends';

function Friends({ socket }) {

    const user = useSelector(state => state.session.user);
    const friends = useSelector(state => state.session.friends);
        
    const [ onlineFriends, setOnlineFriends ] = useState(friends? friends.filter(friend => friend.online === true && friend.isFriend === true) : '');
    const [ pendingFriends, setPendingFriends ] = useState(friends? friends.filter(friend => friend.isFriend === false && +friend.receiver_id === +user.id) : '');
    const [ offlineFriends, setOfflineFriends ] = useState(friends? friends.filter(friend => friend.online === false && friend.isFriend === true) : '');


    useEffect(() => {

        // create websocket/connect
        socket.on('online', (userId) => {
         
            const friend = friends.find(friend => friend.id === userId);
            console.log(friend, userId)
            friend.online = true;
            console.log(friend, userId)
            const isOnline = onlineFriends.find(onlineFriend => onlineFriend.id === userId);
            if (friend && friend.isFriend && !isOnline) {
                setOnlineFriends([ ...onlineFriends, friend ]);
                setOfflineFriends(friends.filter(offlineFriend => offlineFriend.online === false && offlineFriend.isFriend === true && offlineFriend.id !== friend.id));
                socket.emit('online', user.id)
            } 
            
        })

        socket.on('confirm-friend', friend => {
        
            if (friend.id === user.id) {
                const newFriend = friends.find(newFriend => newFriend.id === friend.current_user);
                newFriend.isFriend = true;
                setOnlineFriends([ ...onlineFriends, newFriend ]);
                socket.emit('online', user.id)
                return;
            }
            
            if (friend.receiver_id === user.id) {
                
                setPendingFriends(pendingFriends.filter(pendingFriend => pendingFriend.id !== friend.id));
                const isOnline = onlineFriends.find(onlineFriend => onlineFriend.id === friend.id);
                
                if(friend.online && !isOnline) {
                    setOnlineFriends([ ...onlineFriends, friend ])
                } else {
                    setOfflineFriends([ ...offlineFriends, friend ])
                }
            }
        })

        socket.on('deny-friend', (friend) => {

            const pendingFriend = pendingFriends.find(pending => pending.id === friend.id);
            if (pendingFriend) {
                setPendingFriends(pendingFriends.filter(filterFriend => filterFriend.id !== friend.id))
            }
        })

        socket.on('log-out', (user) => {
     
            const friend = onlineFriends.find(onlineFriend => onlineFriend.id === user.id)
            if (friend) {
                setOnlineFriends(onlineFriends.filter(friend => friend.id !== user.id));
                setOfflineFriends([ ...offlineFriends, user])
            }
        })

        socket.on('ruin-friendship', (friend) => {
            console.log('WUT', friend.friend_id)
            
            if (friend.online) {
                setOnlineFriends(onlineFriends.filter(remaining => remaining.friend_id !== friend.friend_id && remaining.id !== friend.id))
            } else {
                setOfflineFriends(offlineFriends.filter(remaining => remaining.friend_id !== friend.friend_id && remaining.id !== friend.id))
            }

        })

        // when component unmounts, disconnect
        return (() => {
            socket.disconnect()
        })
    }, [friends, offlineFriends, onlineFriends, pendingFriends, user.id])

    return (
        <div className='friends-container'>
            <div className='friends-nav'>
                <Link className='links' to='/'>Friends</Link>
                <p> | </p>
                <Link className='links' to='/pending'>Pending</Link>
            </div>
            <Switch>
                <Route exact path='/'>
                    <OnlineFriends 
                        socket={socket} 
                        onlineFriends={onlineFriends} 
                        setOnlineFriends={setOnlineFriends} 
                        friends={friends} 
                        offlineFriends={offlineFriends} 
                        setOfflineFriends={setOfflineFriends}
                        />
                </Route>
                <Route exact path='/pending'>
                    <PendingFriends 
                    user={user} 
                    pendingFriends={pendingFriends} 
                    socket={socket} 
                    />
                </Route>
            </Switch>
        </div>
    )
}

export default Friends;