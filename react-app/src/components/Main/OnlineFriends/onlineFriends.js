

function OnlineFriends({ socket, onlineFriends, offlineFriends }) {

    
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
                    { offlineFriends.map(friend => (
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