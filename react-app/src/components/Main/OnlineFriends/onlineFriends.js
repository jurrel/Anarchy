import VideoModal from "../../videoModal";

function OnlineFriends({ socket, onlineFriends, offlineFriends }) {


    const ruinFriendship = (friend) => {
        // console.log(friend)
        socket.emit('ruin-friendship', friend)
    }

    return (
        <>
            <div className='online-friends'>
                <div className='friends'>
                    <h3>Online:</h3>
                    { onlineFriends && onlineFriends && onlineFriends.map(friend => (
                        <div key={friend.id} className='friend'>
                            <img alt='profile' src={friend.profile_picture}></img>
                            <div className='friend-info'>
                                <p>{friend.username}</p>
                                <div className='friend-buttons'>
                                    <button type='button'><i className="fas fa-comment-dots" /></button>
                                    <VideoModal friend={friend} socket={socket} />
                                    <button onClick={() => ruinFriendship(friend)} type='button'><i className="far fa-trash-alt" /></button>
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
                    { offlineFriends && offlineFriends.map(friend => (
                        <div key={friend.id} className='friend'>
                            <img alt='profile' src={friend.profile_picture}></img>
                            <div className='friend-info'>
                                <p>{friend.username}</p>
                                <div className='friend-buttons'>
                                    <button type='button'><i className="fas fa-comment-dots" /></button>
                                    <button onClick={() => ruinFriendship(friend)} type='button'><i className="far fa-trash-alt" /></button>
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
