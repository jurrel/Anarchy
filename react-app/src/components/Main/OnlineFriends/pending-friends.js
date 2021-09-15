

function PendingFriends({ pendingFriends, socket, user }) {


    const confirmFriend = (friend) => {
        friend.current_user = user.id
        socket.emit('confirm-friend', friend);
    }

    const denyFriend = (friend) => {
        // make socket for denying friend
        console.log('DENY FRIEND')
        socket.emit('deny-friend', friend)
    }


    return (
        <div className='friends'>
            { pendingFriends && pendingFriends.map(friend => (
                <div key={friend.id} className='friend'>
                    <img alt='profile' src={friend.profile_picture}></img>
                    <div className='friend-info'>
                        <h3>{friend.username}</h3>
                        <div className='friend-buttons'>
                            <button onClick={() => confirmFriend(friend)} type='button'><i className="fas fa-check" /></button>
                            <button onClick={() => denyFriend(friend)} type='button'><i className="fas fa-times" /></button>
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