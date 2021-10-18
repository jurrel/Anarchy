import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import OnlineFriends from './onlineFriends';
import PendingFriends from './pending-friends';

import './friends.css';

function Friends({ socket }) {
	const user = useSelector((state) => state.session.user);
	const state_friends = useSelector((state) => state.session.friends);

	const [friends, setFriends] = useState(state_friends);
	const [onlineFriends, setOnlineFriends] = useState(
		friends
			? friends.filter(
					(friend) => friend.online === true && friend.isFriend === true
			  )
			: ''
	);
	const [pendingFriends, setPendingFriends] = useState(
		friends
			? friends.filter(
					(friend) =>
						friend.isFriend === false && +friend.receiver_id === +user.id
			  )
			: ''
	);
	const [offlineFriends, setOfflineFriends] = useState(
		friends
			? friends.filter(
					(friend) => friend.online === false && friend.isFriend === true
			  )
			: ''
	);

	const [showFriends, setShowFriends] = useState(true);
	const [showPending, setShowPending] = useState(false);
	const [results, setResults] = useState('');
    const [value, setValue] = useState('');
    const [friendAdded, setFriendAdded] = useState(false);


	useEffect(() => {

		socket.on('online', (userId) => {
			const friend = friends.find((friend) => friend.id === userId);
			const isOnline = onlineFriends.find(friend => friend.id === userId);
			if (friend && friend.isFriend && !isOnline) {
				setOnlineFriends([...onlineFriends, friend]);
				setOfflineFriends(
					friends.filter(
						(offlineFriend) =>
							offlineFriend.online === false &&
							offlineFriend.isFriend === true &&
							offlineFriend.id !== friend.id
					)
				);
			}
		});

		// return () => socket.off('online');
	}, [friends, onlineFriends, socket])

	useEffect(() => {

		socket.on('confirm-friend', (friend) => {
			if (friend.id === user.id) {
				const newFriend = friends.find(
					(newFriend) => newFriend.id === friend.current_user
				);
				newFriend.isFriend = true;
				setOnlineFriends([...onlineFriends, newFriend]);
				socket.emit('online', user.id);
				return;
			}
	
			if (friend.receiver_id === user.id) {
				setPendingFriends(
					pendingFriends.filter(
						(pendingFriend) => pendingFriend.id !== friend.id
					)
				);
				const isOnline = onlineFriends.find(
					(onlineFriend) => onlineFriend.id === friend.id
				);
	
				if (friend.online && !isOnline) {
					setOnlineFriends([...onlineFriends, friend]);
				} else {
					setOfflineFriends([...offlineFriends, friend]);
				}
			}
		});

		// return () => socket.off('confirm-friend')
	}, [friends, offlineFriends, onlineFriends, pendingFriends, socket, user.id])

	useEffect(() => {

		socket.on('deny-friend', (friend) => {
			const pendingFriend = pendingFriends.find(
				(pending) => pending.id === friend.id
			);
			if (pendingFriend) {
				setPendingFriends(
					pendingFriends.filter((filterFriend) => filterFriend.id !== friend.id)
				);
			}
		});

		// return () => socket.off('deny-friend');
	}, [pendingFriends, socket])

	useEffect(() => {
		
		socket.on('log-out', (user) => {
			const friend = onlineFriends.find(
				(onlineFriend) => onlineFriend.id === user.id
			);
			if (friend) {
				setOfflineFriends([...offlineFriends, ...onlineFriends.filter(friend => friend.id === user.id)]);
				setOnlineFriends(
					onlineFriends.filter((friend) => friend.id !== user.id)
				);
			}
		});

		// return () => socket.off('log-out');
	}, [offlineFriends, onlineFriends, socket])


	useEffect(() => {

		socket.on('ruin-friendship', (friend) => {

			setFriends(friends.filter(frand => frand.id !== friend.id));
	
			if (friend.online) {
				setOnlineFriends(
					friends.filter(
						(remaining) =>
							remaining.friend_id !== friend.friend_id &&
							remaining.id !== friend.id
					)
				);
			} else {
				setOfflineFriends(
					friends.filter(
						(remaining) =>
							remaining.friend_id !== friend.friend_id &&
							remaining.id !== friend.id
					)
				);
			}
		});
	
		// return () => socket.off('ruin-friendship');
	}, [friends, offlineFriends, onlineFriends, pendingFriends, socket, user.id]);

	useEffect(() => {

        socket.on('add-friend', friend => {
            if (friend.receiver_id === user.id) {
                setPendingFriends([...pendingFriends, friend]);
            }
            setValue('');
            setResults('');
            setFriendAdded(!friendAdded);
            setTimeout(() => {
                setFriendAdded(false)
            }, 2000)
        })

        // return () => socket.off('add-friend')
    }, [friendAdded, pendingFriends, setPendingFriends, socket, user.id])



	const toggleFriends = (e) => {
		if (!showFriends) {
			setShowFriends(true);
			setShowPending(false);
		}
	};

	const togglePending = (e) => {
		if (!showPending) {
			setShowPending(true);
			setShowFriends(false);
		}
	};

	return (
		<div className="friends-container">
			<div className="friends-nav">
				<button className="links" onClick={(e) => toggleFriends(e)}>
					Friends
				</button>
				<p> | </p>
				<button className="links" onClick={(e) => togglePending(e)}>
					Pending
				</button>
			</div>
			{showFriends && (
				<OnlineFriends
					socket={socket}
					onlineFriends={onlineFriends}
					setOnlineFriends={setOnlineFriends}
					friends={friends}
					offlineFriends={offlineFriends}
					setOfflineFriends={setOfflineFriends}
					setFriends={setFriends}
				/>
			)}
			{showPending && (
				<PendingFriends
					user={user}
					pendingFriends={pendingFriends}
					setPendingFriends={setPendingFriends}
					socket={socket}
					setResults={setResults}
					value={value}
					setValue={setValue}
					results={results}
					friendAdded={friendAdded}

				/>
			)}
		</div>
	);
}

export default Friends;
