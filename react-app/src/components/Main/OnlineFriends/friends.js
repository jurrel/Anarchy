import { Route, Switch, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import OnlineFriends from './onlineFriends';
import PendingFriends from './pending-friends';

function Friends({ socket }) {

    const friends = useSelector(state => state.session.friends);
    const user = useSelector(state => state.session.user);
        
    const [ pendingFriends, setPendingFriends ] = useState(friends.filter(friend => friend.isFriend === false && +friend.receiver_id === +user.id));
    const [ onlineFriends, setOnlineFriends ] = useState(friends.filter(friend => friend.online === true && friend.isFriend === true));


    useEffect(() => {

        if (!friends) return;
        
        socket.on('online', (userId) => {
            const friend = friends.find(friend => friend.id === userId);
            if (friend && friend.isFriend) {
                setOnlineFriends([ ...onlineFriends, friend ])
            } 
        })

        return () => socket.off('online')
    }, [friends, onlineFriends, onlineFriends.length, socket])


    useEffect(() => {

        socket.on('friend-confirmed', ({ sender_id, receiver_id }) => {

            const friend = pendingFriends.find(friend => friend.sender_id === sender_id && friend.receiver_id === receiver_id);
            friend.isFriend = true;
            
            setPendingFriends(friends.filter(friend => friend.isFriend === false && +friend.receiver_id === +user.id));
            if (friend.online) {
                setOnlineFriends([ ...onlineFriends, friend ])
            }
        })

        return () => socket.off('friend-confirmed')
    }, [friends, onlineFriends, pendingFriends, socket, user.id])

    return (
        <div className='friends-container'>
            <div className='friends-nav'>
                <Link className='links' to='/'>Friends</Link>
                <p> | </p>
                <Link className='links' to='/pending'>Pending</Link>
            </div>
            <Switch>
                <Route exact path='/'>
                    <OnlineFriends socket={socket} onlineFriends={onlineFriends} friends={friends} />
                </Route>
                <Route exact path='/pending'>
                    <PendingFriends user={user} pendingFriends={pendingFriends} socket={socket} />
                </Route>
            </Switch>
        </div>
    )
}

export default Friends;