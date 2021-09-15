import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


function PendingFriends() {

    const friends = useSelector(state => state.session.friends);
        
    const [ pendingFriends, setPendingFriends ] = useState(friends.filter(friend => friend.isFriend === false));

    const confirmFriend = () => {
        // make socket route for confirming friend
        console.log('CONFIRM FRIEND')
    }

    const denyFriend = () => {
        // make thunk for denying friend
        console.log('DENY FRIEND')
    }


    return (
        <div className='friends'>
            { pendingFriends && pendingFriends.map(friend => (
                <div key={friend.id} className='friend'>
                    <img alt='profile' src={friend.profile_picture}></img>
                    <div className='friend-info'>
                        <h3>{friend.username}</h3>
                        <div className='friend-buttons'>
                            <button onClick={() => confirmFriend()} type='button'><i className="fas fa-check" /></button>
                            <button onClick={() => denyFriend()} type='button'><i className="fas fa-times" /></button>
                        </div>
                    </div>
                </div>
            ))}
            { !pendingFriends.length && (
                <div className='friend'>
                    <i className="far fa-frown-open fa-3x" />
                    <p>Nobodies around!</p>
                </div>
            )}
        </div>
    )
}

export default PendingFriends;