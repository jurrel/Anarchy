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
        
        socket.on('online', (userId) => {
            
            const friend = friends.find(friend => friend.id === userId);
            console.log('ONLINE', friend)
            const isOnline = onlineFriends.find(onlineFriend => onlineFriend.id === userId);

            if ((friend && friend.isFriend) && !isOnline) {
                setOnlineFriends([ ...onlineFriends, friend ]);
                setOfflineFriends(friends.filter(offlineFriend => offlineFriend.online === false && offlineFriend.isFriend === true && offlineFriend !== friend));
            } 
        })

        return () => socket.off('online')
    }, [friends, onlineFriends, onlineFriends.length, socket])


    useEffect(() => {

        socket.on('confirm-friend', friend => {

            if (friend.id === user.id) {
                const newFriend = friends.find(newFriend => newFriend.id === friend.current_user);
                newFriend.isFriend = true;
                setOnlineFriends([ ...onlineFriends, newFriend ])
                return;
            }
            console.log(friend)

            if (friend.receiver_id === user.id) {

                setPendingFriends(pendingFriends.filter(pendingFriend => pendingFriend.id !== friend.id));
                const isOnline = onlineFriends.find(onlineFriend => onlineFriend.id === friend.id);
                console.log(isOnline)

                if(friend.online && !isOnline) {
                    console.log('SETTING ONLINE FRIEND')
                    setOnlineFriends([ ...onlineFriends, friend ])
                } else {
                    setOfflineFriends([ ...offlineFriends, friend ])
                }
            }
        })

        return () => socket.off('friend-confirmed')
    }, [friends, offlineFriends, onlineFriends, pendingFriends, socket, user, user.id])

    useEffect(() => {

        socket.on('deny-friend', (friend) => {
            const pendingFriend = pendingFriends.find(pending => pending.id === friend.id);
            console.log(pendingFriend)
            if (pendingFriend) {
                setPendingFriends(pendingFriends.filter(filterFriend => filterFriend.id !== friend.id))
            }
        })

        return () => socket.off('deny-friend')
    })

    useEffect(() => {

        socket.on('log-out', (userId) => {
            setOnlineFriends(onlineFriends.filter(friend => friend.id !== userId))
        })

        return () => socket.off('log-out')
    })

    return (
        <div className='friends-container'>
            <div className='friends-nav'>
                <Link className='links' to='/'>Friends</Link>
                <p> | </p>
                <Link className='links' to='/pending'>Pending</Link>
            </div>
            <Switch>
                <Route exact path='/'>
                    <OnlineFriends socket={socket} onlineFriends={onlineFriends} friends={friends} offlineFriends={offlineFriends} />
                </Route>
                <Route exact path='/pending'>
                    <PendingFriends user={user} pendingFriends={pendingFriends} socket={socket} />
                </Route>
            </Switch>
        </div>
    )
}

export default Friends;