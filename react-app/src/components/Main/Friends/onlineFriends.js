import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Socket } from '../../context/socket';

import VideoModal from "../../videoModal";
import PrivateMessageModal from '../PrivateMessage';

function OnlineFriends({ onlineFriends, offlineFriends, setOnlineFriends, friends, setFriends }) {
    const socket = Socket();

    const user = useSelector( state => state.session.user);

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
        // setFriends(friends.filter(online => online.id !== friend.id && online.isFriend))
        friend.user_id = user.id;
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
                                    <PrivateMessageModal friend={friend} />
                                    <VideoModal call={call} setCall={setCall} friend={friend} />
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
                                    <PrivateMessageModal friend={friend} />
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
