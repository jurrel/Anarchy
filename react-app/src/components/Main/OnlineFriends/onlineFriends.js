import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


function OnlineFriends({ socket }) {

    const friends = useSelector(state => state.session.friends);

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

    return (
        <>
            <div className='online-friends'>
                <div className='friends'>
                    <h3>Online:</h3>
                    { onlineFriends && onlineFriends.map(friend => (
                        <div key={friend.id} className='friend'>
                            <img alt='profile' src={friend.profile_picture}></img>
                            <div className='friend-info'>
                                <h3>{friend.username}</h3>
                                <div className='friend-buttons'>
                                    <button type='button'><i className="fas fa-comment-dots" /></button>
                                    <button type='button'><i className="far fa-trash-alt" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    { !onlineFriends.length && (
                        <div className='friend'>
                            <i className="far fa-frown-open fa-3x" />
                            <p>Nobodies around!</p>
                        </div>
                    )}
                </div>
            </div>
            <div className='offline-friends'>
                <div className='friends'>
                    <h3>Offline:</h3>
                    { friends.filter(friend => friend.isFriend === true).map(friend => (
                        <div key={friend.id} className='friend'>
                            <img alt='profile' src={friend.profile_picture}></img>
                            <div className='friend-info'>
                                <h3>{friend.username}</h3>
                                <div className='friend-buttons'>
                                    <button type='button'><i className="fas fa-comment-dots" /></button>
                                    <button type='button'><i className="far fa-trash-alt" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default OnlineFriends;