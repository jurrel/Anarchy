import { useState, useEffect } from 'react';

import VideoModal from "../../videoModal";
import PrivateMessageModal from '../PrivateMessage';

function OnlineFriends({ socket, onlineFriends, offlineFriends, setOnlineFriends, friends, setFriends }) {

    const [call, setCall] = useState(false);

    useEffect(() => {
        if (!call) return;
        const ring = document.getElementById('ringtone');
        const source = ring.src;
        ring.play();

        setTimeout(() => {
          ring.pause();
          ring.src = source;
        }, 5000)

    }, [call])


    const ruinFriendship = (friend) => {
        setFriends(friends.filter(online => online.id !== friend.id && online.isFriend))
        socket.emit('ruin-friendship', friend)
    }



    return (
        <>
            <div className='online-friends'>
                <div className='friends'>
                    <h3>ONLINE -- {onlineFriends.length}</h3>
                    { onlineFriends && onlineFriends && onlineFriends.map(friend => (
                        <div key={friend.id} className='friend'>
                            <img alt='profile' src={friend.profile_picture}></img>
                            <div className='friend-info'>
                                <p>{friend.username}</p>
                                <div className='friend-buttons'>
                                    <PrivateMessageModal socket={socket} friend={friend} />
                                    {/* <button type='button'><i className="fas fa-comment-dots" /></button> */}
                                    <VideoModal call={call} setCall={setCall} friend={friend} socket={socket} />
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
                <audio src="/ringtone.wav" width="0" height="0" id="ringtone" enablejavascript="true"></audio>
            </div>
            <div className='offline-friends'>
                <div className='friends'>
                    <h3>OFFLINE -- {offlineFriends.length}</h3>
                    { offlineFriends && offlineFriends.map(friend => (
                        <div key={friend.id} className='friend'>
                            <img alt='profile' src={friend.profile_picture}></img>
                            <div className='friend-info'>
                                <p>{friend.username}</p>
                                <div className='friend-buttons'>
                                    {/* <button type='button'><i className="fas fa-comment-dots" /></button> */}
                                    <PrivateMessageModal socket={socket} friend={friend} />
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
