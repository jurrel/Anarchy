import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function PendingFriends({ pendingFriends, socket, user, setPendingFriends, setResults, value, setValue, results, friendAdded }) {

    const friends = useSelector(state => state.session.friends);
    const friendIds = friends.map(friend => friend.id);

    useEffect(() => {

        socket.on('search-for-friend', results => {
            if (!value) {
                setResults('');
            } else {
                setResults(results);
            }
        })

        return () => socket.off('search-for-friend')
    }, [results, setResults, socket, value])


    const addFriend = (result) => {
        const data = {
            'sender_id': user.id,
            'receiver_id': result.id
        }

        socket.emit('add-friend', data)
    }


    const confirmFriend = (friend) => {
        friend.current_user = user.id;
        socket.emit('confirm-friend', friend);
        setPendingFriends(pendingFriends.filter(pendingFriend => pendingFriend.id !== friend.id))
    }

    const denyFriend = (friend) => {
        socket.emit('deny-friend', friend)
        setPendingFriends(pendingFriends.filter(pendingFriend => pendingFriend.id !== friend.id))
    }

    const handleSearch = (e) => {
        e.preventDefault();

        socket.emit('search', value);
    }


    return (
        <div className='friends'>
            <div id='friend-search'>
            <form autoComplete='off' onSubmit={handleSearch}>
                <input id='search-bar' value={value} onChange={(e) => {
                    socket.emit('search-friend', e.target.value);
                    setValue(e.target.value);
                }} placeholder='Add friends'></input>
            </form>
            <ul id='list'>
                { results && results.map(result => (
                    <li className='list-item' onClick={() => addFriend(result)} key={result.id}>
                        <img src={result.profile_picture} alt='serve'></img>
                        <p>{result.username}</p>
                    </li>
                ))}
                { friendAdded && (
                    <p>Friend request sent!</p>
                )}
            </ul>
        </div>
            { pendingFriends && pendingFriends.map(friend => (
                <div key={friend.id} className='friend'>
                    <img alt='profile' src={friend.profile_picture}></img>
                    <div className='friend-info'>
                        <p>{friend.username}</p>
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