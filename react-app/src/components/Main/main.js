import './main.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { Redirect } from 'react-router-dom';


import './main.css';
import Friends from './Friends/friends';
import Servers from './Servers/servers';
import MenuModal from './Menu';
import useWindowResize from '../resize';
import { Socket } from '../context/socket';

// let endPoint = process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:5000/';

// let socket = process.env.NODE_ENV === 'production' ? io() : io.connect(`${endPoint}`);

// let socket = io(); FOR DEPLOYMENT


function Main() {
    const size = useWindowResize();
    const socket = Socket();

	const user = useSelector((state) => state.session.user);

    const [showFriends, setShowFriends] = useState(false);

	useEffect(() => {
		socket.emit('online', user.id);
	});

    // useEffect(() => {

    //     // if (size.width > 750) return;
    //     setShowFriends(size.width > 750 ? true : false);
        
    // }, [size])

    useEffect(() => {
        if (!user) {
            Redirect('/about')
        }
    })
    

	return (
        <div className="main-container">
            {size.width > 750 && (
                <>
                <Servers />
                <Friends />
                </>
            )}
            {!showFriends && size.width < 750 && (
                <Servers />
            )}
            {showFriends && (
                <Friends />
            )}
            <div className={showFriends ? "user_profile_name shift" : "user_profile_name"}>
                <div className='user-profile'>
                    <img
                        alt="profile"
                        src={user.profile_picture}
                        className="user_profile_photo"
                    />
                    <p>{user.username}</p>
                </div>
                <div className='menu-buttons'>
                    <button
                        onClick={() => setShowFriends(!showFriends)}
                        className={size.width < 750 ? 'friends-button settings' : 'hidden'}>
                        {!showFriends && (
                            <i className="fas fa-user-friends fa-2x"></i>
                        )}
                        {showFriends && (
                            <i className="far fa-comment-alt fa-2x"></i>
                        )}
                    </button>
                    <MenuModal />
                </div>
            </div>
        </div>
	);
}

export default Main;
